"use client"

import { forwardRef } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, User, Phone, Mail, MapPin, Heart, CheckCircle } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import {BookingData} from "@/types/appointment";

interface MedicalReceiptProps {
    bookingData: BookingData
}

export const MedicalReceipt = forwardRef<HTMLDivElement, MedicalReceiptProps>(({ bookingData }, ref) => {
    const appointmentDate = new Date(bookingData.appointmentDate ?? "")

    return (
        <div ref={ref} className="bg-white p-8 max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="flex items-center justify-center space-x-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 shadow-lg">
                        <Heart className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-700 to-teal-600 bg-clip-text text-transparent">
                            MediSchedule
                        </h1>
                        <p className="text-sm text-teal-600 font-medium">Healthcare Platform</p>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg border border-emerald-200">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                        <h2 className="text-lg font-bold text-emerald-800">PHIẾU KHÁM BỆNH</h2>
                    </div>
                    <p className="text-emerald-700 font-medium">Mã số: {bookingData.appointmentCode}</p>
                </div>
            </div>

            {/* Patient Information */}
            <Card className="mb-6">
                <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <User className="h-5 w-5 mr-2 text-teal-600" />
                        Thông tin bệnh nhân
                    </h3>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Họ và tên</p>
                            <p className="font-semibold text-gray-900">{bookingData.patientName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Số điện thoại</p>
                            <p className="font-semibold text-gray-900 flex items-center">
                                <Phone className="h-4 w-4 mr-1 text-gray-500" />
                                {bookingData.patientPhone}
                            </p>
                        </div>
                        <div className="md:col-span-2">
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="font-semibold text-gray-900 flex items-center">
                                <Mail className="h-4 w-4 mr-1 text-gray-500" />
                                {bookingData.patientEmail}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Appointment Information */}
            <Card className="mb-6">
                <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-teal-600" />
                        Thông tin lịch khám
                    </h3>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Bác sĩ</p>
                            <p className="font-semibold text-gray-900">{bookingData.doctorName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Chuyên khoa</p>
                            <Badge className="bg-teal-100 text-teal-700">{bookingData.specialty}</Badge>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Ngày khám</p>
                            <p className="font-semibold text-gray-900 flex items-center">
                                <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                                {format(appointmentDate, "EEEE, dd/MM/yyyy", { locale: vi })}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Giờ khám</p>
                            <p className="font-semibold text-gray-900 flex items-center">
                                <Clock className="h-4 w-4 mr-1 text-gray-500" />
                                {bookingData.appointmentTime}
                            </p>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm text-gray-600">Địa điểm</p>
                        <p className="font-semibold text-gray-900 flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                            Bệnh viện Đa khoa Trung ương
                        </p>
                    </div>

                    {bookingData.symptoms && (
                        <div>
                            <p className="text-sm text-gray-600">Triệu chứng / Lý do khám</p>
                            <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{bookingData.symptoms}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Payment Information */}
            <Card className="mb-6">
                <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900">Thông tin thanh toán</h3>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Phí khám bệnh:</span>
                        <span className="font-semibold">{(bookingData.amount - 10000).toLocaleString()} VNĐ</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Phí dịch vụ:</span>
                        <span className="font-semibold">10.000 VNĐ</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg">
                        <span className="font-semibold">Tổng cộng:</span>
                        <span className="font-bold text-teal-600">{bookingData.amount.toLocaleString()} VNĐ</span>
                    </div>
                    <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-emerald-600" />
                            <span className="text-emerald-700 font-medium">Đã thanh toán qua MoMo</span>
                        </div>
                        <p className="text-sm text-emerald-600 mt-1">
                            Mã giao dịch: {bookingData.transactionId || bookingData.orderId}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
                <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900">Lưu ý quan trọng</h3>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 text-sm text-gray-700">
                        <p>• Vui lòng có mặt tại bệnh viện trước 15 phút so với giờ hẹn</p>
                        <p>• Mang theo CMND/CCCD và phiếu khám này</p>
                        <p>• Liên hệ hotline 1900 1234 nếu cần hỗ trợ</p>
                        <p>• Có thể hủy hoặc đổi lịch trước 24h qua ứng dụng</p>
                    </div>
                </CardContent>
            </Card>

            {/* Footer */}
            <div className="text-center mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">Phiếu khám được tạo tự động bởi hệ thống MediSchedule</p>
                <p className="text-xs text-gray-400 mt-1">
                    Thời gian tạo: {format(new Date(), "dd/MM/yyyy HH:mm", { locale: vi })}
                </p>
            </div>
        </div>
    )
})

MedicalReceipt.displayName = "MedicalReceipt"