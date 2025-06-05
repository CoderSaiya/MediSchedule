"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Search, Settings, User, LogOut, Heart, MessageSquare, Calendar, HelpCircle } from "lucide-react"
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/store";
import {logout} from "@/store/slices/authSlice";
import {DoctorProfile} from "@/types/doctor";

interface DoctorHeaderProps {
    doctorInfo: DoctorProfile
}

export default function Header({ doctorInfo }: DoctorHeaderProps) {
    const [notifications] = useState(3)
    const dispatch = useDispatch<AppDispatch>();

    const handleLogout = () => {
        dispatch(logout());
        window.location.href = "/login"
    }

    const doctorName = doctorInfo?.name || "BS. Nguyễn Văn An"
    const doctorSpecialty = doctorInfo?.specialty || "Chuyên khoa Tim mạch"

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
            <div className="flex h-16 items-center justify-between px-6">
                {/* Logo */}
                <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-teal-600">
                        <Heart className="h-4 w-4 text-white" />
                    </div>
                    <div>
            <span className="text-lg font-bold bg-gradient-to-r from-teal-700 to-teal-600 bg-clip-text text-transparent">
              MediSchedule
            </span>
                        <Badge className="ml-2 bg-teal-100 text-teal-700 text-xs">Doctor Portal</Badge>
                    </div>
                </div>

                {/* Search */}
                <div className="flex-1 max-w-md mx-8">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Tìm kiếm bệnh nhân, lịch hẹn..."
                            className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
                        />
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center space-x-4">
                    {/* Quick Actions */}
                    <Button variant="ghost" size="sm" className="hidden md:flex">
                        <Calendar className="h-4 w-4 mr-2" />
                        Lịch hẹn
                    </Button>
                    <Button variant="ghost" size="sm" className="hidden md:flex">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Tin nhắn
                    </Button>

                    {/* Notifications */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="relative">
                                <Bell className="h-4 w-4" />
                                {notifications > 0 && (
                                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">
                                        {notifications}
                                    </Badge>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80">
                            <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <div className="space-y-2 p-2">
                                <div className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Lịch hẹn mới</p>
                                        <p className="text-xs text-gray-600">Bệnh nhân Nguyễn Văn F đặt lịch 14:00</p>
                                        <p className="text-xs text-gray-500">5 phút trước</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Nhắc nhở</p>
                                        <p className="text-xs text-gray-600">Cập nhật hồ sơ bệnh án</p>
                                        <p className="text-xs text-gray-500">15 phút trước</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Hoàn thành khám</p>
                                        <p className="text-xs text-gray-600">Đã khám xong cho bệnh nhân Lê Minh C</p>
                                        <p className="text-xs text-gray-500">30 phút trước</p>
                                    </div>
                                </div>
                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-center text-teal-600 font-medium">
                                Xem tất cả thông báo
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={doctorInfo?.avatar} alt="Doctor" />
                                    <AvatarFallback className="bg-teal-100 text-teal-700">BS</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{doctorName}</p>
                                    <p className="text-xs leading-none text-muted-foreground">{doctorSpecialty}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                <span>Hồ sơ cá nhân</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Cài đặt</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <HelpCircle className="mr-2 h-4 w-4" />
                                <span>Hỗ trợ</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Đăng xuất</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}