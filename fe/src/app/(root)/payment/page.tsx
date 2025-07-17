"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Clock, ArrowLeft, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { QRCodeDisplay } from "@/components/payment/qr-code-display"
import { PaymentStatusMonitor } from "@/components/payment/payment-status-monitor"
import { ReceiptGenerator } from "@/components/payment/receipt-generator"
import { useCreateMomoPaymentMutation, useCreateAppointmentMutation } from "@/api"
import { formatVND } from "@/lib/formatAmout"
import {AppointmentData, BookingData} from "@/types/appointment";
import {PaymentData} from "@/types/payment";

type PaymentStatus = "pending" | "processing" | "success" | "failed"

export default function PaymentPage() {
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("pending")
    const [bookingData, setBookingData] = useState<AppointmentData | null>(null)
    const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [receiptUrl, setReceiptUrl] = useState<string | null>(null)

    const [createMomoPayment, { isLoading: isCreatingPayment }] = useCreateMomoPaymentMutation()
    const [createAppointment, { isLoading: isCreatingAppointment }] = useCreateAppointmentMutation()

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible" && paymentStatus === "processing") {
                console.log("Tab became visible, payment status:", paymentStatus)
            }
        }

        document.addEventListener("visibilitychange", handleVisibilityChange)
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
    }, [paymentStatus])

    useEffect(() => {
        const savedBookingData = localStorage.getItem("bookingData")
        if (savedBookingData) {
            const data = JSON.parse(savedBookingData)
            console.log("Loaded booking data:", data)
            setBookingData(data)

            const appointmentData: AppointmentData = {
                appointmentId: data.appointmentId,
                appointmentCode: data.appointmentCode,
                orderId: data.orderId,
                doctorId: data.doctorId,
                date: data.date,
                time: data.time,
                specialty: data.specialty,
                doctor: data.doctor,
                fullName: data.fullName,
                phone: data.phone,
                email: data.email,
                symptoms: data.symptoms,
                totalAmount: data.totalAmount,
                specialtyPrice: data.specialtyPrice,
                serviceFee: data.serviceFee,
                slotId: data.slotId,
            }
            setBookingData(appointmentData)

            // Create MoMo payment intent
            handleCreatePayment(data)
        } else {
            setError("Không tìm thấy thông tin đặt lịch")
        }
    }, [])

    const handleCreatePayment = async (data: any) => {
        try {
            console.log("Creating MoMo payment for:", data)

            const paymentAmount = data.totalAmount || 0

            const response = await createMomoPayment({
                amount: paymentAmount,
                orderInfo: `Thanh toán khám ${data.specialty} - ${data.doctor}`,
                extraData: JSON.stringify({
                    doctorId: data.doctorId,
                    appointmentDate: data.date,
                    appointmentTime: data.time,
                    specialty: data.specialty,
                }),
            }).unwrap()

            if (response.data) {
                console.log("Payment created successfully:", response.data)
                setPaymentData(response.data)
                setPaymentStatus("processing")
            }
        } catch (error: any) {
            setError(error.data?.message || "Không thể tạo thanh toán")
            setPaymentStatus("failed")
        }
    }

    const handlePaymentSuccess = async () => {
        console.log("🎉 Payment success callback triggered!")

        if (!bookingData || !paymentData) {
            console.error("Missing booking data or payment data")
            return
        }

        try {
            console.log("Creating appointment after successful payment...")

            const slotId = bookingData.slotId

            if (!slotId) {
                console.error("SlotId not found for selected time:", bookingData.time)
                setError("Không tìm thấy thông tin slot. Vui lòng thử lại.")
                setPaymentStatus("failed")
                return
            }

            // Create appointment với đúng format backend expect
            const appointmentResponse = await createAppointment({
                doctorId: bookingData.doctorId,
                slotId: slotId,
                patientName: bookingData.fullName,
                patientPhone: bookingData.phone,
                patientEmail: bookingData.email,
                appointmentDate: bookingData.date, // YYYY-MM-DD
                appointmentTime: bookingData.time, // HH:mm
                reason: bookingData.symptoms || "Khám tổng quát",
                orderId: paymentData.orderId,
            }).unwrap()

            console.log("Appointment response:", appointmentResponse)

            const appointmentId = appointmentResponse.data
            const appointmentCode = appointmentResponse.data

            if (appointmentId) {
                console.log("Appointment created successfully:", appointmentId)

                const updatedBookingData = {
                    ...bookingData,
                    appointmentCode: appointmentCode,
                    appointmentId: appointmentId,
                }

                setBookingData(updatedBookingData)
                setPaymentStatus("success")

                localStorage.removeItem("bookingData")

                console.log("✅ Đặt lịch thành công! Đang tạo phiếu khám...")

                setTimeout(() => {
                    const receiptSection = document.querySelector("[data-receipt-section]")
                    if (receiptSection) {
                        receiptSection.scrollIntoView({ behavior: "smooth" })
                    }
                }, 1000)
            } else {
                throw new Error("Không nhận được ID lịch hẹn từ server")
            }
        } catch (error: any) {
            console.error("Error creating appointment:", error)
            setError(error.data?.message || "Không thể tạo lịch hẹn")
            setPaymentStatus("failed")
        }
    }

    const handlePaymentFailed = (errorMessage: string) => {
        console.log("❌ Payment failed:", errorMessage)
        setError(errorMessage)
        setPaymentStatus("failed")
    }

    const handleReceiptUpload = (url: string) => {
        setReceiptUrl(url)
        console.log("Receipt uploaded to:", url)
    }

    const getSpecialtyPrice = () => bookingData?.specialtyPrice || 0
    const getServiceFee = () => bookingData?.serviceFee || 10000
    const getTotalAmount = () => bookingData?.totalAmount || getSpecialtyPrice() + getServiceFee()

    if (!bookingData && !error) {
        return (
            <div className="m-20">
                <div className="max-w-2xl mx-auto text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p>Đang tải thông tin...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="m-20">
                <div className="max-w-2xl mx-auto text-center">
                    <Card className="border-red-200 bg-red-50">
                        <CardContent className="p-8">
                            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-red-800 mb-2">Có lỗi xảy ra</h2>
                            <p className="text-red-600 mb-6">{error}</p>
                            <div className="space-y-3">
                                <Link href="/booking">
                                    <Button className="w-full">Quay lại đặt lịch</Button>
                                </Link>
                                <Link href="/">
                                    <Button variant="outline" className="w-full">
                                        Về trang chủ
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    if (paymentStatus === "success") {
        const converted: BookingData = {
            appointmentId: bookingData!.appointmentId,
            appointmentCode: bookingData!.appointmentCode,
            patientName: bookingData!.fullName,
            patientPhone: bookingData!.phone,
            patientEmail: bookingData!.email,
            doctorName: bookingData!.doctor,
            specialty: bookingData!.specialty,
            appointmentDate: bookingData!.date,
            appointmentTime: bookingData!.time,
            symptoms: bookingData!.symptoms,
            amount: bookingData!.totalAmount,
            orderId: bookingData!.orderId,
        };

        return (
            <div className="m-20">
                <div data-receipt-section className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Đặt lịch thành công!</h1>
                        <p className="text-gray-600 mb-6">
                            Cảm ơn bạn đã tin tưởng MediSchedule. Phiếu khám đã được tạo và gửi qua email.
                        </p>
                    </div>

                    <ReceiptGenerator
                        bookingData={converted}
                        onUploadComplete={handleReceiptUpload}
                    />

                    <div className="text-center mt-8">
                        <div className="space-y-4">
                            <Link href="/">
                                <Button className="w-full sm:w-auto">Về trang chủ</Button>
                            </Link>
                            <Link href="/my-appointments">
                                <Button variant="outline" className="w-full sm:w-auto ml-0 sm:ml-4">
                                    Xem lịch hẹn của tôi
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="m-20">
            {/* Payment Status Monitor */}
            {paymentData && paymentStatus === "processing" && (
                <PaymentStatusMonitor
                    orderId={paymentData.orderId}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentFailed={handlePaymentFailed}
                    enabled={true}
                />
            )}
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center mb-6">
                    <Link href="/booking">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Quay lại
                        </Button>
                    </Link>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Thanh toán lịch khám</h1>
                    <p className="text-gray-600">
                        {paymentStatus === "pending" && "Đang tạo thanh toán..."}
                        {paymentStatus === "processing" && "Vui lòng hoàn tất thanh toán để xác nhận lịch hẹn"}
                        {paymentStatus === "failed" && "Thanh toán thất bại"}
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Booking Summary */}
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>Thông tin đặt lịch</CardTitle>
                            <CardDescription>Xem lại thông tin lịch hẹn của bạn</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Bệnh nhân:</span>
                                    <span className="font-medium">{bookingData?.fullName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Số điện thoại:</span>
                                    <span className="font-medium">{bookingData?.phone}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Chuyên khoa:</span>
                                    <span className="font-medium">{bookingData?.specialty}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Bác sĩ:</span>
                                    <span className="font-medium">{bookingData?.doctor}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Ngày khám:</span>
                                    <span className="font-medium">{bookingData?.date}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Giờ khám:</span>
                                    <span className="font-medium">{bookingData?.time}</span>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Phí khám {bookingData?.specialty}:</span>
                                    <span className="font-medium">{formatVND(getSpecialtyPrice())}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Phí dịch vụ:</span>
                                    <span className="font-medium">{formatVND(getServiceFee())}</span>
                                </div>
                                <div className="flex justify-between font-semibold text-lg">
                                    <span>Tổng cộng:</span>
                                    <span className="text-blue-600">{formatVND(getTotalAmount())}</span>
                                </div>
                            </div>

                            {paymentStatus === "processing" && (
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <div className="flex items-center space-x-2 text-blue-700">
                                        <Clock className="h-4 w-4 animate-pulse" />
                                        <span className="text-sm font-medium">Đang chờ thanh toán...</span>
                                    </div>
                                    {paymentData && <p className="text-xs text-blue-600 mt-1">Mã đơn hàng: {paymentData.orderId}</p>}
                                </div>
                            )}

                            {isCreatingAppointment && (
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <div className="flex items-center space-x-2 text-green-700">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span className="text-sm font-medium">Đang tạo lịch hẹn...</span>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Payment Section */}
                    <div className="space-y-6">
                        {isCreatingPayment ? (
                            <Card className="shadow-lg">
                                <CardContent className="p-8 text-center">
                                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">Đang tạo thanh toán</h3>
                                    <p className="text-gray-600">Vui lòng đợi trong giây lát...</p>
                                </CardContent>
                            </Card>
                        ) : paymentData ? (
                            <QRCodeDisplay
                                payUrl={paymentData.payUrl}
                                orderId={paymentData.orderId}
                                amount={getTotalAmount()}
                                onPaymentSuccess={handlePaymentSuccess}
                                onPaymentFailed={handlePaymentFailed}
                            />
                        ) : (
                            <Card className="shadow-lg border-red-200 bg-red-50">
                                <CardContent className="p-8 text-center">
                                    <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-red-800 mb-2">Không thể tạo thanh toán</h3>
                                    <p className="text-red-600 mb-4">Vui lòng thử lại sau</p>
                                    <Button onClick={() => window.location.reload()}>Thử lại</Button>
                                </CardContent>
                            </Card>
                        )}

                        {/* Security Notice */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-start space-x-3">
                                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                                    <CheckCircle className="h-3 w-3 text-green-600" />
                                </div>
                                <div className="text-sm text-gray-600">
                                    <p className="font-medium mb-1">Thanh toán an toàn</p>
                                    <p>Thông tin thanh toán được mã hóa SSL 256-bit và tuân thủ tiêu chuẩn bảo mật PCI DSS.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}