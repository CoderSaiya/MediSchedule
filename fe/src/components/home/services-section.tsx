"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
    Heart,
    Brain,
    Eye,
    Bone,
    Baby,
    Stethoscope,
    Clock,
    Users,
    Star,
    ArrowRight,
    CheckCircle,
    TrendingUp,
    Activity,
    Zap,
} from "lucide-react"
import Link from "next/link"
import {useGetSpecialtiesQuery} from "@/api";
import { iconMap } from "@/lib/icon"
import {formatVND} from "@/lib/formatAmout";

export default function ServicesSection() {
    const {data: specialtiesResponse, isLoading, error} = useGetSpecialtiesQuery();

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error!</p>;

    const specialties = specialtiesResponse?.data;
    console.log(specialtiesResponse);

    // const services = [
    //     {
    //         icon: Heart,
    //         title: "Tim mạch",
    //         description:
    //             "Khám và điều trị các bệnh lý về tim mạch với đội ngũ bác sĩ chuyên khoa giàu kinh nghiệm và trang thiết bị hiện đại nhất.",
    //         color: "text-red-600",
    //         bgColor: "bg-gradient-to-br from-red-50 to-red-100",
    //         borderColor: "border-red-200",
    //         doctors: 15,
    //         avgTime: "45 phút",
    //         rating: 4.9,
    //         price: "200.000đ",
    //         features: ["Siêu âm tim", "Điện tâm đồ", "Holter 24h", "Thông tim"],
    //         available: true,
    //         successRate: 98,
    //         patientsSatisfied: 2500,
    //         waitTime: "< 15 phút",
    //         nextAvailable: "Hôm nay, 14:30",
    //     },
    //     {
    //         icon: Brain,
    //         title: "Thần kinh",
    //         description:
    //             "Chẩn đoán và điều trị các rối loạn thần kinh, đau đầu, đột quỵ và các bệnh lý não bộ với công nghệ MRI, CT hiện đại.",
    //         color: "text-purple-600",
    //         bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
    //         borderColor: "border-purple-200",
    //         doctors: 12,
    //         avgTime: "50 phút",
    //         rating: 4.8,
    //         price: "250.000đ",
    //         features: ["MRI não", "CT scan", "Điện não đồ", "Tư vấn tâm lý"],
    //         available: true,
    //         successRate: 95,
    //         patientsSatisfied: 1800,
    //         waitTime: "< 20 phút",
    //         nextAvailable: "Ngày mai, 09:00",
    //     },
    //     {
    //         icon: Eye,
    //         title: "Nhãn khoa",
    //         description:
    //             "Khám mắt tổng quát, điều trị các bệnh về mắt và phẫu thuật mắt với công nghệ Laser hiện đại nhất thế giới.",
    //         color: "text-blue-600",
    //         bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
    //         borderColor: "border-blue-200",
    //         doctors: 8,
    //         avgTime: "30 phút",
    //         rating: 4.9,
    //         price: "150.000đ",
    //         features: ["Khám tổng quát", "Phẫu thuật Laser", "Đo nhãn áp", "Chụp đáy mắt"],
    //         available: true,
    //         successRate: 99,
    //         patientsSatisfied: 3200,
    //         waitTime: "< 10 phút",
    //         nextAvailable: "Hôm nay, 16:00",
    //     },
    //     {
    //         icon: Bone,
    //         title: "Xương khớp",
    //         description:
    //             "Điều trị các bệnh lý về xương khớp, cột sống và phục hồi chức năng vận động với liệu pháp vật lý trị liệu.",
    //         color: "text-orange-600",
    //         bgColor: "bg-gradient-to-br from-orange-50 to-orange-100",
    //         borderColor: "border-orange-200",
    //         doctors: 10,
    //         avgTime: "40 phút",
    //         rating: 4.7,
    //         price: "180.000đ",
    //         features: ["X-quang", "MRI khớp", "Vật lý trị liệu", "Tiêm khớp"],
    //         available: true,
    //         successRate: 92,
    //         patientsSatisfied: 1500,
    //         waitTime: "< 25 phút",
    //         nextAvailable: "Thứ 6, 10:30",
    //     },
    //     {
    //         icon: Baby,
    //         title: "Nhi khoa",
    //         description:
    //             "Chăm sóc sức khỏe toàn diện cho trẻ em từ sơ sinh đến 18 tuổi với đội ngũ bác sĩ nhi khoa tận tâm, chu đáo.",
    //         color: "text-pink-600",
    //         bgColor: "bg-gradient-to-br from-pink-50 to-pink-100",
    //         borderColor: "border-pink-200",
    //         doctors: 18,
    //         avgTime: "35 phút",
    //         rating: 4.9,
    //         price: "120.000đ",
    //         features: ["Khám tổng quát", "Tiêm chủng", "Tư vấn dinh dưỡng", "Theo dõi phát triển"],
    //         available: true,
    //         successRate: 97,
    //         patientsSatisfied: 4500,
    //         waitTime: "< 12 phút",
    //         nextAvailable: "Hôm nay, 15:45",
    //     },
    //     {
    //         icon: Stethoscope,
    //         title: "Nội tổng quát",
    //         description:
    //             "Khám sức khỏe tổng quát, tầm soát bệnh và tư vấn chăm sóc sức khỏe hàng ngày với gói khám toàn diện.",
    //         color: "text-emerald-600",
    //         bgColor: "bg-gradient-to-br from-emerald-50 to-emerald-100",
    //         borderColor: "border-emerald-200",
    //         doctors: 20,
    //         avgTime: "60 phút",
    //         rating: 4.8,
    //         price: "300.000đ",
    //         features: ["Khám tổng quát", "Xét nghiệm máu", "Siêu âm bụng", "Tư vấn sức khỏe"],
    //         available: false,
    //         successRate: 96,
    //         patientsSatisfied: 2800,
    //         waitTime: "< 30 phút",
    //         nextAvailable: "Sắp ra mắt",
    //     },
    // ]

    return (
        <section className="py-24 bg-gradient-to-b from-white to-teal-50 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-30">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, rgb(240 253 250) 2px, transparent 2px), radial-gradient(circle at 75% 75%, rgb(209 250 229) 1px, transparent 1px)`,
                        backgroundSize: "50px 50px",
                    }}
                ></div>
            </div>

            <div className="container mx-auto px-4 relative z-10 max-w-7xl">
                <div className="text-center mb-16">
                    <Badge className="bg-teal-100 text-teal-700 px-6 py-3 mb-6 border-0 text-lg">Chuyên khoa hàng đầu</Badge>
                    <h2 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-6">
                        Dịch vụ y tế{" "}
                        <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              chuyên nghiệp
            </span>
                    </h2>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Đội ngũ bác sĩ chuyên khoa giàu kinh nghiệm, trang thiết bị hiện đại và dịch vụ chăm sóc tận tâm để mang đến
                        trải nghiệm y tế tốt nhất cho bạn và gia đình.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {specialties?.map((service, index) => {
                        const IconComponent = iconMap[service.icon] ?? iconMap['Heart']

                        return (
                        <Card
                            key={index}
                            className={`h-full hover:shadow-2xl transition-all duration-500 border-2 ${service.borderColor} group hover:-translate-y-2 relative overflow-hidden cursor-pointer`}
                        >
                            {/* Background Pattern */}
                            <div
                                className="absolute inset-0 opacity-10"
                                style={{
                                    backgroundImage: `radial-gradient(circle at 25% 25%, rgb(240 253 250) 2px, transparent 2px)`,
                                    backgroundSize: "30px 30px",
                                }}
                            ></div>

                            {/* Availability Badge */}
                            {!service.available && (
                                <div className="absolute top-4 right-4 z-10">
                                    <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                                        Sắp có
                                    </Badge>
                                </div>
                            )}

                            {/* Floating Elements - Only show on hover */}
                            <div className="absolute top-4 right-4 w-8 h-8 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300" />
                            <div className="absolute bottom-4 left-4 w-6 h-6 bg-teal-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-opacity duration-300" />

                            <CardHeader className={`${service.bgColor} relative z-10`}>
                                <div className="flex items-start justify-between mb-4">
                                    <div
                                        className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                                    >
                                        <IconComponent className={`h-8 w-8 ${service.color}`} />
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center space-x-1 mb-1">
                                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                            <span className="text-sm font-bold text-slate-700">{service.rating}</span>
                                        </div>
                                        <p className="text-2xl font-bold text-slate-900">{formatVND(service.price)}</p>
                                    </div>
                                </div>
                                <CardTitle className="text-2xl text-slate-900 mb-2">{service.title}</CardTitle>
                                <div className="flex items-center space-x-4 text-sm text-slate-600">
                                    <div className="flex items-center space-x-1">
                                        <Users className="h-4 w-4" />
                                        <span>{service.doctors} bác sĩ</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Clock className="h-4 w-4" />
                                        <span>{service.avgTime}</span>
                                    </div>
                                </div>

                                {/* Success Rate Progress */}
                                {/*<div className="space-y-2 mt-4">*/}
                                {/*    <div className="flex justify-between text-sm">*/}
                                {/*        <span className="text-slate-600">Tỷ lệ thành công</span>*/}
                                {/*        <span className="font-semibold text-emerald-600">{service.successRate}%</span>*/}
                                {/*    </div>*/}
                                {/*    <Progress value={service.successRate} className="h-2 bg-white/50" />*/}
                                {/*</div>*/}
                            </CardHeader>

                            <CardContent className="p-6 bg-white relative z-10">
                                <CardDescription className="text-slate-600 mb-6 leading-relaxed text-base">
                                    {service.description}
                                </CardDescription>

                                {/* Quick Stats */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="text-center p-3 bg-teal-50 rounded-lg">
                                        <TrendingUp className="h-5 w-5 text-teal-600 mx-auto mb-1" />
                                        <p className="text-lg font-bold text-slate-900">{service.patientsSatisfied}+</p>
                                        <p className="text-xs text-slate-600">Bệnh nhân hài lòng</p>
                                    </div>
                                    <div className="text-center p-3 bg-emerald-50 rounded-lg">
                                        <Activity className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
                                        <p className="text-lg font-bold text-slate-900">{service.waitTime}</p>
                                        <p className="text-xs text-slate-600">Thời gian chờ TB</p>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="mb-6">
                                    <h4 className="font-semibold text-slate-900 mb-3">Dịch vụ bao gồm:</h4>
                                    <div className="space-y-2">
                                        {service.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center space-x-3">
                                                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                                                <span className="text-sm text-slate-600">{feature}</span>
                                                <CheckCircle className="h-4 w-4 text-emerald-500 ml-auto" />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Next Available - Always show for available services */}
                                {service.available && (
                                    <div className="bg-emerald-50 p-3 rounded-lg mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-emerald-700">Lịch trống gần nhất</p>
                                                <p className="text-lg font-bold text-emerald-800">{service.nextAvailable}</p>
                                            </div>
                                            <Zap className="h-6 w-6 text-emerald-600 animate-pulse" />
                                        </div>
                                    </div>
                                )}

                                <Link href="/booking">
                                    <Button
                                        className={`w-full group/btn ${
                                            service.available
                                                ? "bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white"
                                                : "bg-slate-100 text-slate-500 cursor-not-allowed"
                                        } transition-all duration-300`}
                                        disabled={!service.available}
                                    >
                                        {service.available ? (
                                            <>
                                                Đặt lịch khám
                                                <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                            </>
                                        ) : (
                                            "Sắp ra mắt"
                                        )}
                                    </Button>
                                </Link>
                            </CardContent>

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-emerald-500/10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Card>
                    )})}
                </div>
            </div>
        </section>
    )
}