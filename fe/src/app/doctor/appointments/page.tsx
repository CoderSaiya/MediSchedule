"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Search, Filter, Plus, Clock, CheckCircle, AlertTriangle, Loader2 } from "lucide-react"
import { AppointmentCard } from "@/components/doctor-page/appointment-card"
import { motion } from "framer-motion"
import { format, isToday, isTomorrow, isThisWeek } from "date-fns"
import { useGetAppointmentByDoctorQuery } from "@/api"
import type { Appointment, AppointmentStatus } from "@/types/appointment"

export default function DoctorAppointments() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<AppointmentStatus>("all")
    const [selectedTab, setSelectedTab] = useState("today")

    const doctorId = localStorage.getItem("userId")
    const { data, error, isLoading, refetch } = useGetAppointmentByDoctorQuery(doctorId as string)
    const appointments = data?.data || []

    const getFilteredAppointments = () => {
        let filtered = appointments

        if (searchTerm) {
            filtered = filtered.filter(
                (apt: Appointment) =>
                    apt.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    apt.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    apt.phone.includes(searchTerm) ||
                    apt.email.toLowerCase().includes(searchTerm.toLowerCase()),
            )
        }

        if (statusFilter !== "all") {
            filtered = filtered.filter((apt: Appointment) => apt.status === statusFilter)
        }

        switch (selectedTab) {
            case "today":
                filtered = filtered.filter((apt: Appointment) => isToday(new Date(apt.appointmentDate)))
                break
            case "tomorrow":
                filtered = filtered.filter((apt: Appointment) => isTomorrow(new Date(apt.appointmentDate)))
                break
            case "week":
                filtered = filtered.filter((apt: Appointment) => isThisWeek(new Date(apt.appointmentDate)))
                break
            case "selected":
                filtered = filtered.filter(
                    (apt: Appointment) =>
                        format(new Date(apt.appointmentDate), "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd"),
                )
                break
        }

        return filtered.sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())
    }

    const filteredAppointments = getFilteredAppointments()

    const getStatusCount = (status: string) => {
        return appointments.filter((apt: Appointment) => apt.status === status).length
    }

    const getTodayCount = () => {
        return appointments.filter((apt: Appointment) => isToday(new Date(apt.appointmentDate))).length
    }

    const handleStatusFilterChange = (value: string) => {
        if (value === "all" || value === "pending" || value === "confirmed" || value === "completed") {
            setStatusFilter(value as AppointmentStatus)
        }
    }

    const handleDateSelect = (date: Date | undefined) => {
        if (date) {
            setSelectedDate(date)
            setSelectedTab("selected")
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-teal-600" />
                    <p className="text-gray-600">Đang tải danh sách lịch hẹn...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-96">
                <Card className="border-red-200 bg-red-50 max-w-md">
                    <CardContent className="p-8 text-center">
                        <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-red-800 mb-2">Lỗi tải dữ liệu</h3>
                        <p className="text-red-600 mb-4">Không thể tải danh sách lịch hẹn</p>
                        <Button onClick={() => window.location.reload()}>Thử lại</Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý lịch hẹn</h1>
                    <p className="text-gray-600">Xem và quản lý tất cả lịch hẹn của bạn</p>
                </div>
                <Button className="bg-teal-600 hover:bg-teal-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm lịch hẹn
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-teal-700">Hôm nay</p>
                                <p className="text-2xl font-bold text-teal-900">{getTodayCount()}</p>
                            </div>
                            <CalendarIcon className="h-8 w-8 text-teal-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-yellow-700">Chờ xác nhận</p>
                                <p className="text-2xl font-bold text-yellow-900">{getStatusCount("pending")}</p>
                            </div>
                            <Clock className="h-8 w-8 text-yellow-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-700">Đã xác nhận</p>
                                <p className="text-2xl font-bold text-blue-900">{getStatusCount("confirmed")}</p>
                            </div>
                            <AlertTriangle className="h-8 w-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-emerald-700">Hoàn thành</p>
                                <p className="text-2xl font-bold text-emerald-900">{getStatusCount("completed")}</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-emerald-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Tìm kiếm bệnh nhân, lý do khám, số điện thoại..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select value={statusFilter.toString()} onValueChange={handleStatusFilterChange}>
                            <SelectTrigger className="w-full lg:w-48">
                                <SelectValue placeholder="Lọc theo trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                                <SelectItem value="pending">Chờ xác nhận</SelectItem>
                                <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                                <SelectItem value="completed">Hoàn thành</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline">
                            <Filter className="h-4 w-4 mr-2" />
                            Bộ lọc
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Main Content */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Calendar */}
                <div className="lg:col-span-1">
                    <Card className="h-fit">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Lịch làm việc</CardTitle>
                            <CardDescription>Chọn ngày để xem lịch hẹn</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={handleDateSelect}
                                className="rounded-md border w-full"
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Appointments List */}
                <div className="lg:col-span-2">
                    <Card className="h-fit">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg">Danh sách lịch hẹn</CardTitle>
                                    <CardDescription>
                                        {selectedTab === "today" && "Lịch hẹn hôm nay"}
                                        {selectedTab === "tomorrow" && "Lịch hẹn ngày mai"}
                                        {selectedTab === "week" && "Lịch hẹn tuần này"}
                                        {selectedTab === "selected" && `Lịch hẹn ngày ${format(selectedDate, "dd/MM/yyyy")}`}
                                        {selectedTab === "all" && "Tất cả lịch hẹn"}
                                    </CardDescription>
                                </div>
                                <Badge variant="secondary">{filteredAppointments.length} lịch hẹn</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                                <TabsList className="grid w-full grid-cols-5 mb-4">
                                    <TabsTrigger value="today">Hôm nay</TabsTrigger>
                                    <TabsTrigger value="tomorrow">Ngày mai</TabsTrigger>
                                    <TabsTrigger value="week">Tuần này</TabsTrigger>
                                    <TabsTrigger value="selected">Ngày chọn</TabsTrigger>
                                    <TabsTrigger value="all">Tất cả</TabsTrigger>
                                </TabsList>

                                <TabsContent value={selectedTab} className="mt-0">
                                    <div className="space-y-3 max-h-96 overflow-y-auto">
                                        {filteredAppointments.length === 0 ? (
                                            <div className="text-center py-8">
                                                <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                                <h3 className="text-lg font-semibold text-gray-600 mb-2">Không có lịch hẹn nào</h3>
                                                <p className="text-gray-500 text-sm">
                                                    {searchTerm || statusFilter !== "all"
                                                        ? "Thử thay đổi bộ lọc để xem thêm lịch hẹn"
                                                        : "Chưa có lịch hẹn nào được đặt cho thời gian này"}
                                                </p>
                                            </div>
                                        ) : (
                                            filteredAppointments.map((appointment, index) => (
                                                <motion.div
                                                    key={appointment.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                                >
                                                    <AppointmentCard appointment={appointment} refetch={refetch} />
                                                </motion.div>
                                            ))
                                        )}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}