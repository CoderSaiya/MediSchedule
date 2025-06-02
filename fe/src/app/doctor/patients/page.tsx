"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
    Search,
    Filter,
    Plus,
    User,
    Phone,
    Mail,
    Calendar,
    FileText,
    MoreVertical,
    Heart,
    Activity,
    Clock,
    MapPin,
} from "lucide-react"
import { motion } from "framer-motion"

export default function DoctorPatients() {
    const [searchTerm, setSearchTerm] = useState("")

    const patients = [
        {
            id: "1",
            name: "Nguyễn Văn A",
            age: 35,
            gender: "Nam",
            phone: "0901234567",
            email: "nguyenvana@email.com",
            address: "123 Đường ABC, Quận 1, TP.HCM",
            lastVisit: "2024-01-10",
            nextAppointment: "2024-01-20",
            condition: "Cao huyết áp",
            status: "active",
            avatar: "/placeholder.svg",
            totalVisits: 5,
            riskLevel: "medium",
        },
        {
            id: "2",
            name: "Trần Thị B",
            age: 28,
            gender: "Nữ",
            phone: "0907654321",
            email: "tranthib@email.com",
            address: "456 Đường XYZ, Quận 3, TP.HCM",
            lastVisit: "2024-01-12",
            nextAppointment: "2024-01-18",
            condition: "Theo dõi thai kỳ",
            status: "active",
            avatar: "/placeholder.svg",
            totalVisits: 8,
            riskLevel: "low",
        },
        {
            id: "3",
            name: "Lê Minh C",
            age: 42,
            gender: "Nam",
            phone: "0912345678",
            email: "leminhc@email.com",
            address: "789 Đường DEF, Quận 5, TP.HCM",
            lastVisit: "2024-01-15",
            nextAppointment: null,
            condition: "Bệnh tim mạch",
            status: "critical",
            avatar: "/placeholder.svg",
            totalVisits: 12,
            riskLevel: "high",
        },
        {
            id: "4",
            name: "Phạm Thị D",
            age: 55,
            gender: "Nữ",
            phone: "0923456789",
            email: "phamthid@email.com",
            address: "321 Đường GHI, Quận 7, TP.HCM",
            lastVisit: "2024-01-08",
            nextAppointment: "2024-01-25",
            condition: "Tiểu đường",
            status: "stable",
            avatar: "/placeholder.svg",
            totalVisits: 15,
            riskLevel: "medium",
        },
    ]

    const filteredPatients = patients.filter(
        (patient) =>
            patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.phone.includes(searchTerm),
    )

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "active":
                return { color: "bg-green-100 text-green-700", label: "Đang điều trị" }
            case "stable":
                return { color: "bg-blue-100 text-blue-700", label: "Ổn định" }
            case "critical":
                return { color: "bg-red-100 text-red-700", label: "Cần theo dõi" }
            default:
                return { color: "bg-gray-100 text-gray-700", label: "Không xác định" }
        }
    }

    const getRiskConfig = (risk: string) => {
        switch (risk) {
            case "low":
                return { color: "text-green-600", label: "Thấp" }
            case "medium":
                return { color: "text-yellow-600", label: "Trung bình" }
            case "high":
                return { color: "text-red-600", label: "Cao" }
            default:
                return { color: "text-gray-600", label: "Không xác định" }
        }
    }

    return (
        <>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Danh sách bệnh nhân</h1>
                    <p className="text-gray-600">Quản lý thông tin bệnh nhân và hồ sơ y tế</p>
                </div>
                <Button className="bg-teal-600 hover:bg-teal-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm bệnh nhân
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Tổng bệnh nhân</p>
                                <p className="text-3xl font-bold text-gray-900">{patients.length}</p>
                            </div>
                            <User className="h-8 w-8 text-teal-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Đang điều trị</p>
                                <p className="text-3xl font-bold text-green-600">
                                    {patients.filter((p) => p.status === "active").length}
                                </p>
                            </div>
                            <Activity className="h-8 w-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Cần theo dõi</p>
                                <p className="text-3xl font-bold text-red-600">
                                    {patients.filter((p) => p.status === "critical").length}
                                </p>
                            </div>
                            <Heart className="h-8 w-8 text-red-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Lịch hẹn sắp tới</p>
                                <p className="text-3xl font-bold text-blue-600">{patients.filter((p) => p.nextAppointment).length}</p>
                            </div>
                            <Calendar className="h-8 w-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Filter */}
            <Card className="mb-8">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Tìm kiếm bệnh nhân theo tên, số điện thoại, bệnh lý..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Button variant="outline">
                            <Filter className="h-4 w-4 mr-2" />
                            Bộ lọc
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Patients List */}
            <div className="grid gap-6">
                {filteredPatients.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">Không tìm thấy bệnh nhân nào</h3>
                            <p className="text-gray-500">
                                {searchTerm ? "Thử thay đổi từ khóa tìm kiếm" : "Chưa có bệnh nhân nào trong danh sách"}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredPatients.map((patient, index) => (
                        <motion.div
                            key={patient.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                            <Card className="hover:shadow-md transition-all duration-200">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-4 flex-1">
                                            <Avatar className="h-16 w-16">
                                                <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
                                                <AvatarFallback className="bg-teal-100 text-teal-700 text-lg">
                                                    {patient.name
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div className="flex-1 space-y-3">
                                                <div className="flex items-center space-x-3">
                                                    <h3 className="text-xl font-semibold text-gray-900">{patient.name}</h3>
                                                    <Badge className={getStatusConfig(patient.status).color}>
                                                        {getStatusConfig(patient.status).label}
                                                    </Badge>
                                                    <Badge variant="outline" className={getRiskConfig(patient.riskLevel).color}>
                                                        Nguy cơ: {getRiskConfig(patient.riskLevel).label}
                                                    </Badge>
                                                </div>

                                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                                    <div className="flex items-center space-x-2">
                                                        <User className="h-4 w-4 text-gray-400" />
                                                        <span>
                              {patient.age} tuổi, {patient.gender}
                            </span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Phone className="h-4 w-4 text-gray-400" />
                                                        <span>{patient.phone}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Mail className="h-4 w-4 text-gray-400" />
                                                        <span className="truncate">{patient.email}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Activity className="h-4 w-4 text-gray-400" />
                                                        <span>{patient.totalVisits} lần khám</span>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex items-center space-x-2">
                                                        <MapPin className="h-4 w-4 text-gray-400" />
                                                        <span className="text-sm text-gray-600">{patient.address}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Heart className="h-4 w-4 text-gray-400" />
                                                        <span className="text-sm text-gray-600">
                              <span className="font-medium">Bệnh lý:</span> {patient.condition}
                            </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-6 text-sm">
                                                    <div className="flex items-center space-x-2">
                                                        <Clock className="h-4 w-4 text-gray-400" />
                                                        <span className="text-gray-600">
                              Khám gần nhất: {new Date(patient.lastVisit).toLocaleDateString("vi-VN")}
                            </span>
                                                    </div>
                                                    {patient.nextAppointment && (
                                                        <div className="flex items-center space-x-2">
                                                            <Calendar className="h-4 w-4 text-teal-600" />
                                                            <span className="text-teal-600 font-medium">
                                Lịch hẹn: {new Date(patient.nextAppointment).toLocaleDateString("vi-VN")}
                              </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Button size="sm" variant="outline">
                                                <FileText className="h-4 w-4 mr-1" />
                                                Hồ sơ
                                            </Button>
                                            <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                                                <Calendar className="h-4 w-4 mr-1" />
                                                Đặt lịch
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>
                                                        <Phone className="mr-2 h-4 w-4" />
                                                        Gọi điện
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Mail className="mr-2 h-4 w-4" />
                                                        Gửi email
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <FileText className="mr-2 h-4 w-4" />
                                                        Xem hồ sơ đầy đủ
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <User className="mr-2 h-4 w-4" />
                                                        Chỉnh sửa thông tin
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))
                )}
            </div>
        </>
    )
}