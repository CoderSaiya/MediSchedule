"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock, CreditCard, Loader2, AlertCircle, DollarSign } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import {useGetHospitalsQuery, useGetSpecialtiesWithDoctorQuery, useGetTimeSlotsQuery} from "@/api"
import {formatVND} from "@/lib/formatAmout";
import {Hospital} from "@/types/hospital";
import {HospitalSelector} from "@/components/booking/hospital-selector";

interface TimeSlot {
    id: string
    time: string
    isBooked: boolean
}

export default function BookingPage() {
    const [mounted, setMounted] = useState(false)
    const [date, setDate] = useState<Date>()
    const [selectedTime, setSelectedTime] = useState("")
    const [selectedSlotId, setSelectedSlotId] = useState("")
    const [selectedHospital, setSelectedHospital] = useState<Hospital>()
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        specialty: "",
        doctor: "",
        doctorId: "",
        fullName: "",
        phone: "",
        email: "",
        address: "",
        symptoms: "",
        paymentMethod: "",
    })

    // Ensure component is mounted before making API calls
    useEffect(() => {
        setMounted(true)
    }, [])

    const {
        data: hospitalsResponse
    } = useGetHospitalsQuery(undefined, {
        skip: !mounted,
    })

    const {
        data: specialtiesResponse,
        isLoading: specialtiesLoading,
        error: specialtiesError,
    } = useGetSpecialtiesWithDoctorQuery(
        { hospitalId: selectedHospital?.id as string},
        {
            skip: !mounted || !selectedHospital?.id,
        }
    )

    // Improved time slots fetching logic
    const shouldFetchTimeSlots = mounted && !!formData.doctorId && !!date
    const timeSlotsParams = shouldFetchTimeSlots
        ? {
            doctorId: formData.doctorId,
            date: format(date!, "yyyy-MM-dd"),
        }
        : undefined

    const {
        data: timeSlotsResponse,
        isLoading: timeSlotsLoading,
        error: timeSlotsError,
        refetch: refetchTimeSlots,
    } = useGetTimeSlotsQuery(timeSlotsParams!, {
        skip: !shouldFetchTimeSlots,
        // Force refetch when params change
        refetchOnMountOrArgChange: true,
    })

    // Effect to refetch time slots when doctorId or date changes
    useEffect(() => {
        if (shouldFetchTimeSlots) {
            refetchTimeSlots()
        }
    }, [formData.doctorId, date, shouldFetchTimeSlots, refetchTimeSlots])

    const specialties = specialtiesResponse?.data || []
    const timeSlots = timeSlotsResponse?.data || []
    const hospitals = hospitalsResponse?.data || []

    const getSelectedSpecialtyPrice = () => {
        if (!formData.specialty) return 0
        const selectedSpecialty = specialties.find((spec) => spec.name === formData.specialty)
        return selectedSpecialty?.amount || 0
    }

    // Tính tổng tiền (giá chuyên khoa + phí dịch vụ)
    const getServiceFee = () => 10000 // Phí dịch vụ cố định 10k
    const getTotalAmount = () => getSelectedSpecialtyPrice() + getServiceFee()

    const getAvailableDoctors = () => {
        if (!formData.specialty) return []
        const selectedSpecialty = specialties.find((spec) => spec.name === formData.specialty)
        return selectedSpecialty?.doctorNames || []
    }

    const handleHospitalSelect = (hospital: Hospital) => {
        setSelectedHospital(hospital)
        setFormData((prev) => ({
            ...prev,
            hospitalId: hospital.id,
            hospitalName: hospital.name,
            specialty: "",
            doctor: "",
            doctorId: "",
        }))
        setSelectedTime("")
        setSelectedSlotId("")
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))

        // Reset doctor when specialty changes
        if (field === "specialty") {
            setFormData((prev) => ({ ...prev, doctor: "", doctorId: "" }))
            setSelectedTime("")
            setSelectedSlotId("")
            setDate(undefined) // Also reset date when specialty changes
        }
    }

    const handleDoctorChange = (doctorName: string) => {
        const availableDoctors = getAvailableDoctors()
        const selectedDoctor = availableDoctors.find((doc) => doc.name === doctorName)

        setFormData((prev) => ({
            ...prev,
            doctor: doctorName,
            doctorId: selectedDoctor?.id || "",
        }))

        // Reset time when doctor changes
        setSelectedTime("")
        setSelectedSlotId("")
    }

    const handleDateChange = (newDate: Date | undefined) => {
        setDate(newDate)
        // Reset time when date changes
        setSelectedTime("")
        setSelectedSlotId("")
    }

    const handleTimeSlotSelect = (slot: TimeSlot) => {
        if (!slot.isBooked) {
            setSelectedTime(slot.time)
            setSelectedSlotId(slot.id)
        }
    }

    const handleNext = () => {
        if (step < 4) setStep(step + 1)
    }

    const handlePrevious = () => {
        if (step > 1) setStep(step - 1)
    }

    const handleSubmit = () => {
        // Save booking data and redirect to payment
        const bookingData = {
            ...formData,
            date: date ? format(date, "yyyy-MM-dd") : "",
            time: selectedTime,
            slotId: selectedSlotId,
            specialtyPrice: getSelectedSpecialtyPrice(),
            serviceFee: getServiceFee(),
            totalAmount: getTotalAmount(),
        }

        // Store in localStorage for payment page
        localStorage.setItem("bookingData", JSON.stringify(bookingData))
        window.location.href = "/payment"
    }

    // Manual refresh function for time slots
    const handleRefreshTimeSlots = () => {
        if (shouldFetchTimeSlots) {
            refetchTimeSlots()
        }
    }

    // Show loading state while mounting or loading data
    if (!mounted || specialtiesLoading) {
        return (
            <div className="m-20">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <p className="text-lg">Đang tải dữ liệu...</p>
                    </div>
                </div>
            </div>
        )
    }

    // Show error state
    if (specialtiesError) {
        return (
            <div className="m-20">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <div className="flex items-center justify-center mb-4">
                            <AlertCircle className="h-8 w-8 text-red-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-red-800 mb-2">Lỗi tải dữ liệu</h2>
                        <p className="text-red-600">Không thể tải danh sách chuyên khoa. Vui lòng thử lại sau.</p>
                        <Button onClick={() => window.location.reload()} className="mt-4" variant="outline">
                            Tải lại trang
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="m-20">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Đặt lịch khám bệnh</h1>
                    <p className="text-gray-600">Vui lòng điền đầy đủ thông tin để đặt lịch khám</p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-8">
                    <div className="flex items-center space-x-4">
                        {[1, 2, 3, 4].map((stepNumber) => (
                            <div key={stepNumber} className="flex items-center">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-300 ${
                                        step >= stepNumber ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-600"
                                    }`}
                                >
                                    {stepNumber}
                                </div>
                                {stepNumber < 4 && (
                                    <div
                                        className={`w-16 h-1 mx-2 transition-colors duration-300 ${step > stepNumber ? "bg-teal-600" : "bg-gray-200"}`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>
                            {step === 1 && "Chọn bệnh viện"}
                            {step === 2 && "Chọn chuyên khoa và bác sĩ"}
                            {step === 3 && "Chọn thời gian khám"}
                            {step === 4 && "Thông tin bệnh nhân"}
                        </CardTitle>
                        <CardDescription>
                            {step === 1 && "Lựa chọn bệnh viện phù hợp với nhu cầu của bạn"}
                            {step === 2 && "Lựa chọn chuyên khoa và bác sĩ phù hợp với nhu cầu của bạn"}
                            {step === 3 && "Chọn ngày và giờ khám thuận tiện"}
                            {step === 4 && "Điền thông tin cá nhân và triệu chứng"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {step === 1 && (
                            <div className="opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards]">
                                <HospitalSelector
                                    hospitals={hospitals}
                                    selectedHospital={selectedHospital}
                                    onHospitalSelect={handleHospitalSelect}
                                />
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6 opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards]">
                                <div className="space-y-2">
                                    <Label htmlFor="specialty">Chuyên khoa</Label>
                                    <Select value={formData.specialty} onValueChange={(value) => handleInputChange("specialty", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn chuyên khoa" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {specialties.map((specialty) => (
                                                <SelectItem key={specialty.name} value={specialty.name}>
                                                    <div className="flex items-center justify-between w-full">
                                                        <span>{specialty.name}</span>
                                                        <span className="ml-4 text-sm font-medium text-teal-600">
                                                            {formatVND(specialty.amount)}
                                                          </span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {formData.specialty && (
                                    <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 opacity-0 animate-[fadeInUp_0.5s_ease-out_0.1s_forwards]">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <DollarSign className="h-5 w-5 text-teal-600" />
                                                <span className="text-teal-700 font-medium">Phí khám {formData.specialty}:</span>
                                            </div>
                                            <span className="text-xl font-bold text-teal-600">
                                                {formatVND(getSelectedSpecialtyPrice())}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {formData.specialty && (
                                    <div className="space-y-2 opacity-0 animate-[fadeInUp_0.5s_ease-out_0.2s_forwards]">
                                        <Label htmlFor="doctor">Bác sĩ</Label>
                                        <Select value={formData.doctor} onValueChange={handleDoctorChange}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn bác sĩ" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {getAvailableDoctors().map((doctorName) => (
                                                    <SelectItem key={doctorName.id} value={doctorName.name}>
                                                        {doctorName.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6 opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards]">
                                <div className="space-y-2">
                                    <Label>Chọn ngày khám</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {date ? format(date, "PPP", { locale: vi }) : "Chọn ngày"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={handleDateChange}
                                                initialFocus
                                                disabled={(date) => date < new Date()}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                {/* Show doctor selection reminder if not selected */}
                                {!formData.doctorId && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                        <div className="flex items-center">
                                            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                                            <p className="text-yellow-700 text-sm">
                                                Vui lòng chọn bác sĩ ở bước trước để xem lịch khám khả dụng.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Show date selection reminder if doctor selected but no date */}
                                {formData.doctorId && !date && (
                                    <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                                        <div className="flex items-center">
                                            <CalendarIcon className="h-5 w-5 text-teal-600 mr-2" />
                                            <p className="text-teal-700 text-sm">Vui lòng chọn ngày khám để xem các khung giờ khả dụng.</p>
                                        </div>
                                    </div>
                                )}

                                {/* Time Slots */}
                                {formData.doctorId && date && (
                                    <div className="space-y-2 opacity-0 animate-[fadeInUp_0.5s_ease-out_0.2s_forwards]">
                                        <div className="flex items-center justify-between">
                                            <Label>Chọn giờ khám</Label>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleRefreshTimeSlots}
                                                disabled={timeSlotsLoading}
                                                className="text-xs"
                                            >
                                                {timeSlotsLoading ? (
                                                    <>
                                                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                                        Đang tải...
                                                    </>
                                                ) : (
                                                    "Làm mới"
                                                )}
                                            </Button>
                                        </div>

                                        {timeSlotsLoading ? (
                                            <div className="flex items-center justify-center py-8">
                                                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                                                <span>Đang tải lịch khám...</span>
                                            </div>
                                        ) : timeSlotsError ? (
                                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                                                        <p className="text-red-600 text-sm">
                                                            Không thể tải lịch khám. Vui lòng kiểm tra kết nối và thử lại.
                                                        </p>
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={handleRefreshTimeSlots}
                                                        className="text-xs ml-2"
                                                    >
                                                        Thử lại
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : timeSlots.length === 0 ? (
                                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                                                <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                                <p className="text-gray-600 font-medium">Không có lịch khám khả dụng</p>
                                                <p className="text-gray-500 text-sm mt-1">Vui lòng chọn ngày khác hoặc bác sĩ khác.</p>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={handleRefreshTimeSlots}
                                                    className="mt-3"
                                                >
                                                    Làm mới lịch khám
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-3 gap-3">
                                                {timeSlots.map((slot: TimeSlot) => (
                                                    <Button
                                                        key={slot.id}
                                                        variant={selectedTime === slot.time ? "default" : "outline"}
                                                        className={`h-12 transition-all duration-200 ${
                                                            slot.isBooked
                                                                ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400 hover:bg-gray-100"
                                                                : "hover:scale-105"
                                                        }`}
                                                        onClick={() => handleTimeSlotSelect(slot)}
                                                        disabled={slot.isBooked}
                                                    >
                                                        <Clock className="mr-2 h-4 w-4" />
                                                        {slot.time}
                                                        {slot.isBooked && <span className="ml-2 text-xs">(Đã đặt)</span>}
                                                    </Button>
                                                ))}
                                            </div>
                                        )}

                                        {/* Selected time confirmation */}
                                        {selectedTime && (
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                                                <div className="flex items-center">
                                                    <Clock className="h-5 w-5 text-green-600 mr-2" />
                                                    <p className="text-green-700 text-sm">
                                                        <span className="font-medium">Đã chọn:</span> {selectedTime} -{" "}
                                                        {date ? format(date, "dd/MM/yyyy") : ""}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {step === 4 && (
                            <div className="space-y-6 opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards]">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName">Họ và tên *</Label>
                                        <Input
                                            id="fullName"
                                            placeholder="Nhập họ và tên"
                                            value={formData.fullName}
                                            onChange={(e) => handleInputChange("fullName", e.target.value)}
                                            className="transition-all duration-200 focus:scale-[1.02]"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Số điện thoại *</Label>
                                        <Input
                                            id="phone"
                                            placeholder="Nhập số điện thoại"
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange("phone", e.target.value)}
                                            className="transition-all duration-200 focus:scale-[1.02]"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Nhập email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                        className="transition-all duration-200 focus:scale-[1.02]"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address">Địa chỉ</Label>
                                    <Input
                                        id="address"
                                        placeholder="Nhập địa chỉ"
                                        value={formData.address}
                                        onChange={(e) => handleInputChange("address", e.target.value)}
                                        className="transition-all duration-200 focus:scale-[1.02]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="symptoms">Triệu chứng / Lý do khám</Label>
                                    <Textarea
                                        id="symptoms"
                                        placeholder="Mô tả triệu chứng hoặc lý do khám bệnh"
                                        value={formData.symptoms}
                                        onChange={(e) => handleInputChange("symptoms", e.target.value)}
                                        className="transition-all duration-200 focus:scale-[1.02]"
                                        rows={4}
                                    />
                                </div>

                                {/* Booking Summary */}
                                <div className="bg-teal-50 p-4 rounded-lg border border-teal-200 opacity-0 animate-[fadeInUp_0.5s_ease-out_0.3s_forwards]">
                                    <h3 className="font-semibold text-gray-900 mb-3">Thông tin đặt lịch</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>Chuyên khoa:</span>
                                            <span className="font-medium">{formData.specialty}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Bác sĩ:</span>
                                            <span className="font-medium">{formData.doctor}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Ngày khám:</span>
                                            <span className="font-medium">{date ? format(date, "dd/MM/yyyy") : ""}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Giờ khám:</span>
                                            <span className="font-medium">{selectedTime}</span>
                                        </div>
                                        <div className="border-t pt-2 mt-2 space-y-1">
                                            <div className="flex justify-between">
                                                <span>Phí khám {formData.specialty}:</span>
                                                <span className="font-medium">{formatVND(getSelectedSpecialtyPrice())}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Phí dịch vụ:</span>
                                                <span className="font-medium">{formatVND(getServiceFee())}</span>
                                            </div>
                                            <div className="flex justify-between border-t pt-1 mt-1">
                                                <span className="font-semibold">Tổng cộng:</span>
                                                <span className="font-bold text-teal-600">{formatVND(getTotalAmount())}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between pt-6">
                            <Button
                                variant="outline"
                                onClick={handlePrevious}
                                disabled={step === 1}
                                className="transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
                            >
                                Quay lại
                            </Button>

                            {step < 4 ? (
                                <Button
                                    onClick={handleNext}
                                    disabled={
                                        (step === 1 && !selectedHospital) ||
                                        (step === 2 && (!formData.specialty || !formData.doctor)) ||
                                        (step === 3 && (!date || !selectedTime))
                                    }
                                    className="transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
                                >
                                    Tiếp tục
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={!formData.fullName || !formData.phone || !formData.email}
                                    className="bg-teal-600 hover:bg-teal-700 transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
                                >
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    Thanh toán
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}