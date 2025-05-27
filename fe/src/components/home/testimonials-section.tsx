"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import Image from "next/image"
import patient1 from "@/../public/imgs/patient1.png"
import patient2 from "@/../public/imgs/patient2.png"
import patient3 from "@/../public/imgs/patient3.png"

export default function TestimonialsSection() {
    const testimonials = [
        {
            name: "Chị Nguyễn Thị Lan",
            age: "35 tuổi",
            content:
                "Đặt lịch rất nhanh chóng và tiện lợi. Bác sĩ tận tâm, chu đáo. Tôi rất hài lòng với dịch vụ của MediSchedule.",
            rating: 5,
            image: patient2,
        },
        {
            name: "Anh Trần Văn Minh",
            age: "42 tuổi",
            content:
                "Hệ thống thanh toán MoMo rất tiện lợi, không phải xếp hàng chờ đợi. Bác sĩ chuyên nghiệp và thân thiện.",
            rating: 5,
            image: patient1,
        },
        {
            name: "Cô Lê Thị Hoa",
            age: "28 tuổi",
            content:
                "Lần đầu sử dụng dịch vụ đặt lịch online, rất ấn tượng với sự chuyên nghiệp và tiện lợi. Sẽ tiếp tục sử dụng.",
            rating: 5,
            image: patient3,
        },
    ]

    return (
        <section className="py-20 bg-teal-50">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Bệnh nhân nói gì về chúng tôi</h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Hàng nghìn bệnh nhân đã tin tưởng và hài lòng với dịch vụ của MediSchedule
                    </p>
                </div>

                <div suppressHydrationWarning className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index} className="h-full">
                            <CardContent className="p-6">
                                <div suppressHydrationWarning className="flex items-center mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                <p className="text-gray-600 mb-6 leading-relaxed">"{testimonial.content}"</p>
                                <div className="flex items-center">
                                    <Image
                                        src={testimonial.image || "/placeholder.svg"}
                                        alt={testimonial.name}
                                        width={60}
                                        height={60}
                                        className="rounded-full mr-4"
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                                        <p className="text-gray-600 text-sm">{testimonial.age}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}