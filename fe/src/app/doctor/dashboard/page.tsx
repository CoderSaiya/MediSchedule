"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Calendar,
    Users,
    CheckCircle,
    Activity,
    Stethoscope,
    FileText,
    MessageSquare,
    Bell,
    Filter,
    Star,
} from "lucide-react"
import { AppointmentCard } from "@/components/doctor-page/appointment-card"
import { StatsCard } from "@/components/doctor-page/stats-card"
import { motion } from "framer-motion"

export default function DoctorDashboard() {
    const [selectedTab, setSelectedTab] = useState("overview")

    const stats = [
        {
            title: "Lịch hẹn hôm nay",
            value: "12",
            change: "+2 so với hôm qua",
            trend: "up",
            icon: Calendar,
            color: "text-teal-600",
            bgColor: "bg-teal-50",
        },
        {
            title: "Bệnh nhân chờ",
            value: "5",
            change: "Đang chờ khám",
            trend: "neutral",
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Hoàn thành",
            value: "7",
            change: "+3 so với hôm qua",
            trend: "up",
            icon: CheckCircle,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50",
        },
        {
            title: "Đánh giá TB",
            value: "4.9",
            change: "Từ 45 đánh giá",
            trend: "up",
            icon: Star,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50",
        },
    ]

    const todayAppointments = [
        {
            id: "1",
            patientName: "Nguyễn Văn A",
            patientAge: 35,
            appointmentTime: "09:00",
            appointmentType: "Khám tổng quát",
            status: "confirmed",
            symptoms: "Đau đầu, chóng mặt",
            phone: "0901234567",
            isUrgent: false,
        },
        {
            id: "2",
            patientName: "Trần Thị B",
            patientAge: 28,
            appointmentTime: "09:30",
            appointmentType: "Tái khám",
            status: "waiting",
            symptoms: "Theo dõi huyết áp",
            phone: "0907654321",
            isUrgent: false,
        },
        {
            id: "3",
            patientName: "Lê Minh C",
            patientAge: 42,
            appointmentTime: "10:00",
            appointmentType: "Khám cấp cứu",
            status: "urgent",
            symptoms: "Đau ngực, khó thở",
            phone: "0912345678",
            isUrgent: true,
        },
        {
            id: "4",
            patientName: "Phạm Thị D",
            patientAge: 55,
            appointmentTime: "10:30",
            appointmentType: "Tư vấn",
            status: "confirmed",
            symptoms: "Tư vấn dinh dưỡng",
            phone: "0923456789",
            isUrgent: false,
        },
        {
            id: "5",
            patientName: "Hoàng Văn E",
            patientAge: 38,
            appointmentTime: "11:00",
            appointmentType: "Khám định kỳ",
            status: "completed",
            symptoms: "Kiểm tra sức khỏe định kỳ",
            phone: "0934567890",
            isUrgent: false,
        },
    ]

    return (
        <>
            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Chào mừng, BS. Nguyễn Văn An</h1>
                <p className="text-gray-600">
                    Hôm nay là{" "}
                    {new Date().toLocaleDateString("vi-VN", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                        <StatsCard {...stat} />
                    </motion.div>
                ))}
            </div>

            {/* Main Content Tabs */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
                    <TabsTrigger value="overview" className="flex items-center space-x-2">
                        <Activity className="h-4 w-4" />
                        <span>Tổng quan</span>
                    </TabsTrigger>
                    <TabsTrigger value="appointments" className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>Lịch hẹn</span>
                    </TabsTrigger>
                    <TabsTrigger value="patients" className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>Bệnh nhân</span>
                    </TabsTrigger>
                    <TabsTrigger value="reports" className="flex items-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <span>Báo cáo</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Today's Schedule */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="flex items-center space-x-2">
                                            <Calendar className="h-5 w-5 text-teal-600" />
                                            <span>Lịch khám hôm nay</span>
                                        </CardTitle>
                                        <CardDescription>{todayAppointments.length} lịch hẹn được lên lịch</CardDescription>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        <Filter className="h-4 w-4 mr-2" />
                                        Lọc
                                    </Button>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {todayAppointments.map((appointment, index) => (
                                        <motion.div
                                            key={appointment.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.4, delay: index * 0.1 }}
                                        >
                                            <AppointmentCard appointment={appointment} />
                                        </motion.div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Quick Actions & Notifications */}
                        <div className="space-y-6">
                            {/* Quick Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Stethoscope className="h-5 w-5 text-teal-600" />
                                        <span>Thao tác nhanh</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button className="w-full justify-start" variant="outline">
                                        <Users className="h-4 w-4 mr-2" />
                                        Xem danh sách chờ
                                    </Button>
                                    <Button className="w-full justify-start" variant="outline">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        Thêm lịch hẹn
                                    </Button>
                                    <Button className="w-full justify-start" variant="outline">
                                        <FileText className="h-4 w-4 mr-2" />
                                        Tạo đơn thuốc
                                    </Button>
                                    <Button className="w-full justify-start" variant="outline">
                                        <MessageSquare className="h-4 w-4 mr-2" />
                                        Tin nhắn bệnh nhân
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Recent Notifications */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Bell className="h-5 w-5 text-teal-600" />
                                        <span>Thông báo</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">Lịch hẹn mới</p>
                                            <p className="text-xs text-gray-600">Bệnh nhân Nguyễn Văn F đặt lịch 14:00</p>
                                            <p className="text-xs text-gray-500">5 phút trước</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">Nhắc nhở</p>
                                            <p className="text-xs text-gray-600">Cập nhật hồ sơ bệnh án cho bệnh nhân Trần Thị B</p>
                                            <p className="text-xs text-gray-500">15 phút trước</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">Hoàn thành</p>
                                            <p className="text-xs text-gray-600">Đã khám xong cho bệnh nhân Lê Minh C</p>
                                            <p className="text-xs text-gray-500">30 phút trước</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="appointments">
                    <Card>
                        <CardHeader>
                            <CardTitle>Quản lý lịch hẹn</CardTitle>
                            <CardDescription>Xem và quản lý tất cả lịch hẹn của bạn</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-500">Tính năng quản lý lịch hẹn sẽ được phát triển ở đây...</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="patients">
                    <Card>
                        <CardHeader>
                            <CardTitle>Danh sách bệnh nhân</CardTitle>
                            <CardDescription>Quản lý thông tin bệnh nhân và hồ sơ y tế</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-500">Tính năng quản lý bệnh nhân sẽ được phát triển ở đây...</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="reports">
                    <Card>
                        <CardHeader>
                            <CardTitle>Báo cáo và thống kê</CardTitle>
                            <CardDescription>Xem báo cáo hiệu suất và thống kê</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-500">Tính năng báo cáo sẽ được phát triển ở đây...</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </>
    )
}