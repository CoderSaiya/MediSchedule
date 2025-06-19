"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Activity,
    Calendar,
    Users,
    FileText,
    MessageSquare,
    Settings,
    BarChart3,
    Clock,
    Stethoscope,
    Pill,
    ChevronLeft,
    ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {DoctorProfile} from "@/types/doctor";

interface DoctorSidebarProps {
    doctorInfo: DoctorProfile
}

export default function Sidebar({ doctorInfo }: DoctorSidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const pathname = usePathname()

    const menuItems = [
        {
            id: "dashboard",
            label: "Tổng quan",
            icon: Activity,
            href: "/doctor/dashboard",
            badge: null,
        },
        {
            id: "appointments",
            label: "Lịch hẹn",
            icon: Calendar,
            href: "/doctor/appointments",
            badge: "5",
        },
        {
            id: "patients",
            label: "Bệnh nhân",
            icon: Users,
            href: "/doctor/patients",
            badge: null,
        },
        {
            id: "consultations",
            label: "Tư vấn",
            icon: MessageSquare,
            href: "/doctor/consultations",
            badge: "2",
        },
        {
            id: "prescriptions",
            label: "Đơn thuốc",
            icon: Pill,
            href: "/doctor/prescriptions",
            badge: null,
        },
        {
            id: "medical-records",
            label: "Hồ sơ y tế",
            icon: FileText,
            href: "/doctor/medical-records",
            badge: null,
        },
        {
            id: "schedule",
            label: "Lịch làm việc",
            icon: Clock,
            href: "/doctor/schedule",
            badge: null,
        },
        {
            id: "reports",
            label: "Báo cáo",
            icon: BarChart3,
            href: "/doctor/reports",
            badge: null,
        },
        {
            id: "settings",
            label: "Cài đặt",
            icon: Settings,
            href: "/doctor/settings",
            badge: null,
        },
    ]

    return (
        <div
            className={cn(
                "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 z-40",
                isCollapsed ? "w-16" : "w-64",
            )}
        >
            {/* Collapse Toggle */}
            <div className="flex justify-end p-2 border-b border-gray-100">
                <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8 p-0">
                    {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </Button>
            </div>

            {/* Doctor Info */}
            {!isCollapsed && (
                <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                            <Stethoscope className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{doctorInfo?.name ?? ""}</p>
                            <p className="text-xs text-gray-500 truncate">{doctorInfo?.specialty ?? ""}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation Menu */}
            <nav className="flex-1 p-2 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link key={item.id} href={item.href}>
                            <Button
                                variant={isActive ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start h-10",
                                    isCollapsed ? "px-2" : "px-3",
                                    isActive && "bg-teal-50 text-teal-700 border-teal-200",
                                )}
                            >
                                <item.icon className={cn("h-4 w-4", isCollapsed ? "" : "mr-3")} />
                                {!isCollapsed && (
                                    <>
                                        <span className="flex-1 text-left">{item.label}</span>
                                        {item.badge && <Badge className="ml-auto bg-red-100 text-red-700 text-xs">{item.badge}</Badge>}
                                    </>
                                )}
                            </Button>
                        </Link>
                    )
                })}
            </nav>

            {/* Quick Stats */}
            {!isCollapsed && (
                <div className="p-4 border-t border-gray-100">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Hôm nay</span>
                            <span className="font-medium text-gray-900">12 lịch hẹn</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Đang chờ</span>
                            <span className="font-medium text-blue-600">5 bệnh nhân</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Hoàn thành</span>
                            <span className="font-medium text-emerald-600">7 ca khám</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}