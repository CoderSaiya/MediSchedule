"use client"

import {useEffect, useState } from "react"
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
    Star, Loader2, AlertCircle,
} from "lucide-react"
import { AppointmentCard } from "@/components/doctor-page/appointment-card"
import { StatsCard } from "@/components/doctor-page/stats-card"
import { motion } from "framer-motion"
import {DashboardStats} from "@/types/doctor";
import {useGetDoctorStatisticsQuery, useGetTodayAppointmentsQuery} from "@/api";
import {Appointment} from "@/types/appointment";
import {StatDoctor} from "@/types";
import {QRScanner} from "@/components/doctor-page/qr-scanner";

export default function DoctorDashboard() {
    const [selectedTab, setSelectedTab] = useState("overview")
    const [stats, setStats] = useState<DashboardStats>({
        totalAppointmentsToday: 0,
        appointmentsDelta: 0,
        totalPendingPatients: 0,
        completedAppointmentsToday: 0,
        completedDelta: 0,
        averageRating: 0
    })
    const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([])


    const {
        data: statisticsResponse,
        error: statisticsError,
        isLoading: statisticsLoading,
        refetch: statisticsRefetch,
    } = useGetDoctorStatisticsQuery("ade33dc5-69b4-4f67-8203-1cfff95d49d6")
    const {
        data: appointmentResponse,
        error: appointmentError,
        isLoading: appointmentLoading } = useGetTodayAppointmentsQuery("ade33dc5-69b4-4f67-8203-1cfff95d49d6")


    useEffect(() => {
        if (statisticsResponse) {
            setStats(statisticsResponse?.data)
        }
    }, [statisticsResponse])

    useEffect(() => {
        if (appointmentResponse) {
            setTodayAppointments(appointmentResponse?.data)
        }
    }, [appointmentResponse])

    console.log(stats)

    const statCards: StatDoctor[] = [
        {
            title: "Lịch hẹn hôm nay",
            value: stats.totalAppointmentsToday.toString(),
            change: `${stats.appointmentsDelta >= 0 ? '+' : ''}${stats.appointmentsDelta} so với hôm qua`,
            trend: stats.appointmentsDelta > 0 ? "up" : stats.appointmentsDelta < 0 ? "down" : "neutral",
            icon: Calendar,
            color: "text-teal-600",
            bgColor: "bg-teal-50",
        },
        {
            title: "Bệnh nhân chờ",
            value: stats.totalPendingPatients.toString(),
            change: "Đang chờ khám",
            trend: "neutral",
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Hoàn thành",
            value: stats.completedAppointmentsToday.toString(),
            change: `${stats.completedDelta >= 0 ? '+' : ''}${stats.completedDelta} so với hôm qua`,
            trend: stats.completedDelta > 0 ? "up" : stats.completedDelta < 0 ? "down" : "neutral",
            icon: CheckCircle,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50",
        },
        {
            title: "Đánh giá TB",
            value: stats.averageRating.toFixed(1),
            change: "Đánh giá trung bình",
            trend: "neutral",
            icon: Star,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50",
        },
    ]

    const handleQRScanSuccess = (appointmentId: string) => {
        statisticsRefetch()
        console.log("QR scan successful for appointment:", appointmentId)
    }

    if (statisticsLoading && appointmentLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-teal-600" />
                    <p className="text-gray-600">Đang tải dữ liệu dashboard...</p>
                </div>
            </div>
        )
    }

    if (appointmentError && statisticsError) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-8 text-center">
                        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-red-800 mb-2">Lỗi tải dữ liệu</h3>
                        <p className="text-red-600 mb-4">Không thể tải thông tin dashboard</p>
                        <Button onClick={() => window.location.reload()}>Thử lại</Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <>
            {/* Welcome Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
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

                    {/* QR Scanner Button */}
                    <div className="flex items-center space-x-3">
                        <QRScanner onScanSuccess={handleQRScanSuccess} />
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, index) => (
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
                                    <div className="flex items-center space-x-2">
                                        <QRScanner onScanSuccess={handleQRScanSuccess} />
                                        <Button variant="outline" size="sm">
                                            <Filter className="h-4 w-4 mr-2" />
                                            Lọc
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {todayAppointments.length === 0 ? (
                                        <div className="text-center py-8">
                                            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                            <h3 className="text-lg font-semibold text-gray-600 mb-2">Không có lịch hẹn nào</h3>
                                            <p className="text-gray-500 mb-4">Hôm nay bạn chưa có lịch hẹn nào được đặt</p>
                                            <QRScanner onScanSuccess={handleQRScanSuccess} />
                                        </div>
                                    ) : (
                                        todayAppointments.map((appointment, index) => (
                                            <motion.div
                                                key={appointment.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                            >
                                                <AppointmentCard appointment={appointment} />
                                            </motion.div>
                                        ))
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Quick Actions & Notifications */}
                        <div className="space-y-6">
                            {/* Quick Actions */}
                            <Card>
                                <CardHeader>
                                    <QRScanner onScanSuccess={handleQRScanSuccess} />
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