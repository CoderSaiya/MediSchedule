"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Star,
    MapPin,
    Calendar,
    Award,
    Clock,
    Users,
    GraduationCap,
    Languages,
    Heart,
    ArrowRight,
    CheckCircle,
    TrendingUp,
    Activity,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export default function DoctorsSection() {
    const [flippedCard, setFlippedCard] = useState<number | null>(null)

    const doctors = [
        {
            name: "BS. Nguyễn Văn An",
            title: "Tiến sĩ Y khoa",
            specialty: "Tim mạch",
            experience: "15 năm kinh nghiệm",
            rating: 4.9,
            reviews: 127,
            patients: 2500,
            location: "Bệnh viện Đa khoa Trung ương",
            image: "/placeholder.svg?height=400&width=400",
            available: true,
            education: "Tiến sĩ Y khoa - Đại học Y Hà Nội",
            languages: ["Tiếng Việt", "English"],
            consultationFee: 200000,
            nextAvailable: "Hôm nay, 14:30",
            specializations: ["Phẫu thuật tim", "Can thiệp mạch vành", "Siêu âm tim"],
            achievements: ["Bác sĩ xuất sắc 2023", "Chứng chỉ ESC"],
            responseTime: "< 2h",
        },
        {
            name: "BS. Trần Thị Bình",
            title: "Thạc sĩ Y khoa",
            specialty: "Nhi khoa",
            experience: "12 năm kinh nghiệm",
            rating: 4.8,
            reviews: 98,
            patients: 1800,
            location: "Bệnh viện Nhi Trung ương",
            image: "/placeholder.svg?height=400&width=400",
            available: true,
            education: "Thạc sĩ Y khoa - Đại học Y Dược TP.HCM",
            languages: ["Tiếng Việt"],
            consultationFee: 180000,
            nextAvailable: "Ngày mai, 09:00",
            specializations: ["Nhi tim mạch", "Dinh dưỡng trẻ em", "Phát triển trẻ"],
            achievements: ["Bác sĩ trẻ tiêu biểu", "Chứng chỉ AAP"],
            responseTime: "< 1h",
        },
        {
            name: "BS. Lê Minh Cường",
            title: "Giáo sư, Tiến sĩ",
            specialty: "Thần kinh",
            experience: "18 năm kinh nghiệm",
            rating: 4.9,
            reviews: 156,
            patients: 3200,
            location: "Bệnh viện Bach Mai",
            image: "/placeholder.svg?height=400&width=400",
            available: false,
            education: "Tiến sĩ Y khoa - Đại học Y Hà Nội",
            languages: ["Tiếng Việt", "English", "Français"],
            consultationFee: 250000,
            nextAvailable: "Thứ 6, 15:00",
            specializations: ["Đột quỵ não", "Parkinson", "Động kinh"],
            achievements: ["Giáo sư trẻ nhất", "Giải thưởng nghiên cứu"],
            responseTime: "< 3h",
        },
    ]

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-100 rounded-full -translate-x-32 -translate-y-32 opacity-50"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-100 rounded-full translate-x-48 translate-y-48 opacity-30"></div>

            <div className="container mx-auto px-4 relative z-10 max-w-7xl">
                <div className="text-center mb-16">
                    <Badge className="bg-emerald-100 text-emerald-700 px-6 py-3 mb-6 border-0 text-lg">Đội ngũ y bác sĩ</Badge>
                    <h2 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-6">
                        Bác sĩ{" "}
                        <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              hàng đầu
            </span>
                    </h2>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Các bác sĩ chuyên khoa giàu kinh nghiệm, được đào tạo bài bản tại các trường đại học y khoa danh tiếng trong
                        và ngoài nước.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {doctors.map((doctor, index) => (
                        <div key={index} className="group perspective-1000">
                            <div
                                className={`relative w-full h-full transition-transform duration-700 preserve-3d ${
                                    flippedCard === index ? "rotate-y-180" : ""
                                }`}
                                style={{
                                    transformStyle: "preserve-3d",
                                }}
                            >
                                {/* Front Side */}
                                <Card
                                    className="absolute inset-0 border-2 border-teal-100 hover:border-teal-300 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden"
                                    style={{
                                        backfaceVisibility: "hidden",
                                    }}
                                >
                                    {/* Background Pattern */}
                                    <div
                                        className="absolute inset-0 opacity-5"
                                        style={{
                                            backgroundImage: `radial-gradient(circle at 25% 25%, rgb(240 253 250) 2px, transparent 2px)`,
                                            backgroundSize: "30px 30px",
                                        }}
                                    ></div>

                                    <div className="relative overflow-hidden">
                                        <div className="relative h-64 overflow-hidden">
                                            <Image
                                                src={doctor.image || "/placeholder.svg"}
                                                alt={doctor.name}
                                                width={400}
                                                height={300}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />

                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                                            {/* Status Indicators */}
                                            <div className="absolute top-4 left-4 flex flex-col space-y-2">
                                                {doctor.available ? (
                                                    <Badge className="bg-emerald-500 text-white border-0 shadow-lg">
                                                        <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                                                        Online
                                                    </Badge>
                                                ) : (
                                                    <Badge className="bg-gray-500 text-white border-0 shadow-lg">Offline</Badge>
                                                )}

                                                <Badge className="bg-white/90 text-teal-700 border-0 shadow-lg">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    {doctor.responseTime}
                                                </Badge>
                                            </div>

                                            {/* Quick Stats Overlay */}
                                            <div className="absolute bottom-4 left-4 right-4">
                                                <div className="flex items-center justify-between text-white">
                                                    <div className="flex items-center space-x-1">
                                                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                                        <span className="font-bold">{doctor.rating}</span>
                                                        <span className="text-sm opacity-80">({doctor.reviews})</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <Users className="h-4 w-4" />
                                                        <span className="text-sm font-medium">{doctor.patients}+ bệnh nhân</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Flip Button */}
                                            <button
                                                onClick={() => setFlippedCard(flippedCard === index ? null : index)}
                                                className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                                            >
                                                <ArrowRight className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <CardContent className="p-6 bg-white relative z-10">
                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 mb-1">{doctor.name}</h3>
                                                <p className="text-teal-600 font-semibold text-lg">{doctor.specialty}</p>
                                                <p className="text-slate-600 text-sm">
                                                    {doctor.title} • {doctor.experience}
                                                </p>
                                            </div>

                                            {/* Quick Info Grid */}
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="bg-teal-50 p-3 rounded-lg text-center">
                                                    <TrendingUp className="h-5 w-5 text-teal-600 mx-auto mb-1" />
                                                    <p className="text-lg font-bold text-slate-900">{doctor.rating}</p>
                                                    <p className="text-xs text-slate-600">Đánh giá</p>
                                                </div>
                                                <div className="bg-emerald-50 p-3 rounded-lg text-center">
                                                    <Activity className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
                                                    <p className="text-lg font-bold text-slate-900">{doctor.patients}+</p>
                                                    <p className="text-xs text-slate-600">Bệnh nhân</p>
                                                </div>
                                            </div>

                                            {/* Location & Next Available */}
                                            <div className="space-y-2">
                                                <div className="flex items-center text-slate-600 text-sm">
                                                    <MapPin className="h-4 w-4 mr-2 text-teal-600" />
                                                    <span>{doctor.location}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center text-sm">
                                                        <Calendar className="h-4 w-4 mr-2 text-emerald-600" />
                                                        <span className="text-slate-600">Lịch trống: </span>
                                                        <span className="font-medium text-emerald-600 ml-1">{doctor.nextAvailable}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Price Display */}
                                            <div className="bg-gradient-to-r from-teal-50 to-emerald-50 p-4 rounded-lg">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm text-slate-600">Phí khám từ</p>
                                                        <p className="text-2xl font-bold text-teal-700">
                                                            {doctor.consultationFee.toLocaleString()}đ
                                                        </p>
                                                    </div>
                                                    <Heart className="h-8 w-8 text-red-400 animate-pulse" />
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="space-y-3">
                                                <Link href="/booking">
                                                    <Button
                                                        className={`w-full group transition-all duration-300 ${
                                                            doctor.available
                                                                ? "bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white"
                                                                : "bg-gray-100 text-gray-500 cursor-not-allowed"
                                                        }`}
                                                        disabled={!doctor.available}
                                                    >
                                                        <Calendar className="h-4 w-4 mr-2" />
                                                        {doctor.available ? "Đặt lịch khám" : "Hết lịch"}
                                                        {doctor.available && (
                                                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                                        )}
                                                    </Button>
                                                </Link>

                                                <Button
                                                    variant="outline"
                                                    className="w-full border-teal-200 text-teal-700 hover:bg-teal-50"
                                                    onClick={() => setFlippedCard(flippedCard === index ? null : index)}
                                                >
                                                    Xem hồ sơ chi tiết
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Back Side */}
                                <Card
                                    className="absolute inset-0 border-2 border-emerald-100 overflow-hidden"
                                    style={{
                                        backfaceVisibility: "hidden",
                                        transform: "rotateY(180deg)",
                                    }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50"></div>

                                    <CardContent className="p-6 h-full flex flex-col relative z-10">
                                        {/* Header */}
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <h3 className="font-bold text-slate-900">{doctor.name}</h3>
                                                <p className="text-sm text-emerald-600">{doctor.specialty}</p>
                                            </div>

                                            <button
                                                onClick={() => setFlippedCard(null)}
                                                className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 hover:bg-emerald-200 transition-colors"
                                            >
                                                <ArrowRight className="h-4 w-4 rotate-180" />
                                            </button>
                                        </div>

                                        {/* Detailed Info */}
                                        <div className="space-y-4 flex-1">
                                            {/* Education */}
                                            <div>
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <GraduationCap className="h-4 w-4 text-emerald-600" />
                                                    <h4 className="font-semibold text-slate-900">Học vấn</h4>
                                                </div>
                                                <p className="text-sm text-slate-600 pl-6">{doctor.education}</p>
                                            </div>

                                            {/* Languages */}
                                            <div>
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <Languages className="h-4 w-4 text-emerald-600" />
                                                    <h4 className="font-semibold text-slate-900">Ngôn ngữ</h4>
                                                </div>
                                                <div className="flex flex-wrap gap-1 pl-6">
                                                    {doctor.languages.map((language) => (
                                                        <Badge key={language} className="text-xs bg-emerald-100 text-emerald-700">
                                                            {language}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Specializations */}
                                            <div>
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <Award className="h-4 w-4 text-emerald-600" />
                                                    <h4 className="font-semibold text-slate-900">Chuyên môn</h4>
                                                </div>
                                                <div className="space-y-1 pl-6">
                                                    {doctor.specializations.map((spec, idx) => (
                                                        <div key={idx} className="flex items-center space-x-2">
                                                            <CheckCircle className="h-3 w-3 text-emerald-500" />
                                                            <span className="text-sm text-slate-600">{spec}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <div className="mt-6">
                                            <Link href="/booking">
                                                <Button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white">
                                                    <Calendar className="h-4 w-4 mr-2" />
                                                    Đặt lịch với {doctor.name}
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <Card className="bg-gradient-to-r from-teal-50 to-emerald-50 border-2 border-teal-200 overflow-hidden relative">
                        <CardContent className="p-8 relative z-10">
                            <h3 className="text-3xl font-bold text-slate-900 mb-4">Khám phá thêm nhiều bác sĩ chuyên khoa</h3>
                            <p className="text-slate-600 mb-8 max-w-2xl mx-auto text-lg">
                                Hơn 200+ bác sĩ chuyên khoa hàng đầu đang sẵn sàng phục vụ bạn với các lịch khám linh hoạt và dịch vụ
                                chăm sóc tận tâm.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/doctors">
                                    <Button
                                        size="lg"
                                        className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-8 py-4 text-lg h-14 shadow-xl hover:shadow-2xl transition-all duration-300 group"
                                    >
                                        <Users className="mr-3 h-5 w-5" />
                                        Xem tất cả bác sĩ
                                        <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <Link href="/specialties">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="border-2 border-teal-200 text-teal-700 hover:bg-teal-50 px-8 py-4 text-lg h-14"
                                    >
                                        Tìm theo chuyên khoa
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}