"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Calendar, Clock, Shield, Users, Award, Heart, Activity, Stethoscope } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import doctor from "/public/imgs/doctor2.png"

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-emerald-50 py-16 lg:py-24">
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

            {/* Floating Medical Icons */}
            <div className="absolute top-20 left-10 opacity-20 hidden lg:block">
                <Stethoscope className="h-16 w-16 text-teal-300 animate-pulse" />
            </div>
            <div className="absolute top-40 right-20 opacity-20 hidden lg:block">
                <Heart className="h-12 w-12 text-emerald-300 animate-bounce" />
            </div>
            <div className="absolute bottom-20 left-20 opacity-20 hidden lg:block">
                <Activity className="h-14 w-14 text-blue-300 animate-pulse" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[600px]">
                    {/* Left Content */}
                    <div className="space-y-8 text-center lg:text-left">
                        <div className="space-y-6">
                            <div className="flex items-center justify-center lg:justify-start space-x-4">
                                <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 text-sm font-medium border-0">
                                    <Shield className="mr-2 h-4 w-4" />
                                    Đặt lịch an toàn & tin cậy
                                </Badge>
                                <div className="flex items-center space-x-1">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-teal-600 font-medium">Online 24/7</span>
                                </div>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-slate-900 leading-tight">
                                Chăm sóc{" "}
                                <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                  sức khỏe
                </span>{" "}
                                thông minh
                            </h1>

                            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                Hệ thống đặt lịch khám bệnh trực tuyến hiện đại nhất Việt Nam. Kết nối bạn với các bác sĩ chuyên khoa
                                hàng đầu, thanh toán tiện lợi qua MoMo.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link href="/booking">
                                <Button
                                    size="lg"
                                    className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-8 py-4 text-lg h-14 shadow-xl hover:shadow-2xl transition-all duration-300 group w-full sm:w-auto"
                                >
                                    <Calendar className="mr-3 h-5 w-5" />
                                    Đặt lịch ngay
                                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="/doctors">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="px-8 py-4 text-lg h-14 border-2 border-teal-200 text-teal-700 hover:bg-teal-50 hover:border-teal-300 transition-all duration-300 w-full sm:w-auto"
                                >
                                    <Users className="mr-3 h-5 w-5" />
                                    Tìm bác sĩ
                                </Button>
                            </Link>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-4 lg:gap-6 pt-8">
                            <div className="text-center group">
                                <div className="flex items-center justify-center w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-teal-100 to-teal-200 rounded-2xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                                    <Calendar className="h-6 w-6 lg:h-8 lg:w-8 text-teal-600" />
                                </div>
                                <p className="text-xl lg:text-2xl font-bold text-slate-900">50K+</p>
                                <p className="text-xs lg:text-sm font-medium text-slate-600">Lịch hẹn thành công</p>
                            </div>
                            <div className="text-center group">
                                <div className="flex items-center justify-center w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                                    <Users className="h-6 w-6 lg:h-8 lg:w-8 text-emerald-600" />
                                </div>
                                <p className="text-xl lg:text-2xl font-bold text-slate-900">200+</p>
                                <p className="text-xs lg:text-sm font-medium text-slate-600">Bác sĩ chuyên khoa</p>
                            </div>
                            <div className="text-center group">
                                <div className="flex items-center justify-center w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                                    <Award className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
                                </div>
                                <p className="text-xl lg:text-2xl font-bold text-slate-900">4.9★</p>
                                <p className="text-xs lg:text-sm font-medium text-slate-600">Đánh giá trung bình</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Image */}
                    <div className="relative order-first lg:order-last">
                        <div className="relative max-w-lg mx-auto lg:max-w-none">
                            {/* Main Image */}
                            <div className="relative z-10">
                                <Image
                                    src={doctor}
                                    alt="Bác sĩ chuyên nghiệp"
                                    width={500}
                                    height={600}
                                    className="rounded-3xl shadow-2xl border-4 border-white w-full h-auto"
                                />
                            </div>

                            {/* Floating Cards */}
                            <div className="absolute -top-4 -left-4 lg:-top-6 lg:-left-6 z-20">
                                <Card className="bg-white/95 backdrop-blur border-0 shadow-xl">
                                    <CardContent className="p-3 lg:p-4">
                                        <div className="flex items-center space-x-2 lg:space-x-3">
                                            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                                <Heart className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-lg lg:text-2xl font-bold text-slate-900">99.8%</p>
                                                <p className="text-xs lg:text-sm text-slate-600 font-medium">Tỷ lệ hài lòng</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="absolute -bottom-6 -right-6 lg:-bottom-8 lg:-right-8 z-20">
                                <Card className="bg-white/95 backdrop-blur border-0 shadow-xl">
                                    <CardContent className="p-3 lg:p-4">
                                        <div className="flex items-center space-x-2 lg:space-x-3">
                                            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                                                <Clock className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-lg lg:text-2xl font-bold text-slate-900">&lt; 5 phút</p>
                                                <p className="text-xs lg:text-sm text-slate-600 font-medium">Thời gian đặt lịch</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Background Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-teal-100/50 to-emerald-100/50 rounded-3xl -z-10 transform rotate-3"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}