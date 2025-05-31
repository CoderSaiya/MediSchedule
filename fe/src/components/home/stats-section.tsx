"use client"

import { Users, Calendar, Star, Clock } from "lucide-react"

export default function StatsSection() {
    const stats = [
        {
            icon: Users,
            number: "50+",
            label: "Bác sĩ chuyên khoa",
            color: "text-teal-600",
        },
        {
            icon: Calendar,
            number: "1000+",
            label: "Lịch hẹn thành công",
            color: "text-emerald-600",
        },
        {
            icon: Star,
            number: "4.9/5",
            label: "Đánh giá từ bệnh nhân",
            color: "text-yellow-600",
        },
        {
            icon: Clock,
            number: "24/7",
            label: "Hỗ trợ trực tuyến",
            color: "text-purple-600",
        },
    ]

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4 max-w-7xl">
                <div suppressHydrationWarning className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4`}>
                                <stat.icon className={`h-8 w-8 ${stat.color}`} />
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                            <div className="text-gray-600">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}