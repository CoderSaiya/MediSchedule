"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MapPin, Clock } from "lucide-react"
import Link from "next/link"

export default function ContactSection() {
    const contactInfo = [
        {
            icon: Phone,
            title: "Hotline",
            content: "1900 1234",
            description: "Hỗ trợ 24/7",
        },
        {
            icon: Mail,
            title: "Email",
            content: "sonysam.contacts@gmail.com",
            description: "Phản hồi trong 2h",
        },
        {
            icon: MapPin,
            title: "Địa chỉ",
            content: "Số 2 Võ Oanh, Phường 25, Quận Bình Thạnh, TP. Hồ Chí Minh",
            description: "Trụ sở chính",
        },
        {
            icon: Clock,
            title: "Giờ làm việc",
            content: "24/7",
            description: "Đặt lịch mọi lúc",
        },
    ]

    return (
        <section data-section="contact" className="py-20 bg-white">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Liên hệ với chúng tôi</h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Đội ngũ hỗ trợ chuyên nghiệp luôn sẵn sàng giúp đỡ bạn 24/7
                    </p>
                </div>

                <div suppressHydrationWarning className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {contactInfo.map((info, index) => (
                        <Card key={index} className="text-center h-full">
                            <CardContent className="p-6">
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-100 rounded-lg mb-4">
                                    <info.icon className="h-6 w-6 text-teal-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">{info.title}</h3>
                                <p className="text-teal-600 font-medium mb-1">{info.content}</p>
                                <p className="text-gray-600 text-sm">{info.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="text-center">
                    <div className="bg-teal-600 rounded-2xl p-8 text-white">
                        <h3 className="text-2xl font-bold mb-4">Sẵn sàng đặt lịch khám?</h3>
                        <p className="text-teal-100 mb-6">Chỉ cần vài phút để đặt lịch với bác sĩ chuyên khoa phù hợp</p>
                        <Link href="/booking">
                            <Button size="lg" variant="secondary" className="bg-white text-teal-600 hover:bg-gray-100">
                                Đặt lịch ngay
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}