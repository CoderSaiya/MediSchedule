"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Users, Award, Target, Shield, Clock, Star, CheckCircle, ArrowRight, Stethoscope } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import doctor from "/public/imgs/doctor2.png"

export default function AboutPage() {
    const stats = [
        { icon: Users, number: "50,000+", label: "Bệnh nhân tin tưởng", color: "text-teal-600" },
        { icon: Stethoscope, number: "200+", label: "Bác sĩ chuyên khoa", color: "text-emerald-600" },
        { icon: Award, number: "15+", label: "Năm kinh nghiệm", color: "text-blue-600" },
        { icon: Star, number: "4.9/5", label: "Đánh giá trung bình", color: "text-yellow-600" },
    ]

    const values = [
        {
            icon: Heart,
            title: "Tận tâm chăm sóc",
            description: "Đặt sức khỏe và sự hài lòng của bệnh nhân lên hàng đầu trong mọi dịch vụ.",
            color: "bg-red-50 border-red-200",
            iconColor: "text-red-600",
        },
        {
            icon: Shield,
            title: "An toàn & Bảo mật",
            description: "Bảo vệ thông tin cá nhân với công nghệ mã hóa tiên tiến nhất.",
            color: "bg-green-50 border-green-200",
            iconColor: "text-green-600",
        },
        {
            icon: Target,
            title: "Chính xác & Hiệu quả",
            description: "Cung cấp dịch vụ chính xác, nhanh chóng với quy trình tối ưu.",
            color: "bg-blue-50 border-blue-200",
            iconColor: "text-blue-600",
        },
        {
            icon: Clock,
            title: "Tiện lợi 24/7",
            description: "Hỗ trợ đặt lịch và tư vấn mọi lúc, mọi nơi qua nền tảng trực tuyến.",
            color: "bg-purple-50 border-purple-200",
            iconColor: "text-purple-600",
        },
    ]

    const team = [
        {
            name: "BS. Nguyễn Văn Minh",
            position: "Giám đốc Y khoa",
            experience: "20+ năm kinh nghiệm",
            specialty: "Tim mạch",
            image: "/placeholder.svg?height=300&width=300",
            description: "Chuyên gia hàng đầu về tim mạch với nhiều công trình nghiên cứu quốc tế.",
        },
        {
            name: "BS. Trần Thị Lan",
            position: "Trưởng khoa Nhi",
            experience: "15+ năm kinh nghiệm",
            specialty: "Nhi khoa",
            image: "/placeholder.svg?height=300&width=300",
            description: "Bác sĩ nhi khoa uy tín với hàng nghìn ca điều trị thành công.",
        },
        {
            name: "BS. Lê Hoàng Nam",
            position: "Chuyên gia Thần kinh",
            experience: "18+ năm kinh nghiệm",
            specialty: "Thần kinh",
            image: "/placeholder.svg?height=300&width=300",
            description: "Tiên phong trong điều trị các bệnh lý thần kinh phức tạp.",
        },
    ]

    const milestones = [
        { year: "2009", title: "Thành lập", description: "Ra đời với sứ mệnh cải thiện chăm sóc sức khỏe" },
        { year: "2015", title: "Mở rộng", description: "Phát triển mạng lưới bác sĩ trên toàn quốc" },
        { year: "2020", title: "Số hóa", description: "Ra mắt nền tảng đặt lịch trực tuyến" },
        { year: "2024", title: "Hiện tại", description: "Hơn 50,000 bệnh nhân tin tưởng sử dụng" },
    ]

    return (
        <div className="m-20">
            {/* Hero Section */}
            <section className="relative py-20 bg-gradient-to-br from-teal-50 via-white to-emerald-50 overflow-hidden">
                <div className="absolute inset-0 opacity-30">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `radial-gradient(circle at 25% 25%, rgb(240 253 250) 2px, transparent 2px), radial-gradient(circle at 75% 75%, rgb(209 250 229) 1px, transparent 1px)`,
                            backgroundSize: "50px 50px",
                        }}
                    ></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <Badge className="bg-teal-100 text-teal-700 px-6 py-3 mb-6 border-0 text-lg">Về MediSchedule</Badge>
                        <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-6">
                            Đồng hành cùng{" "}
                            <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                  sức khỏe
                </span>{" "}
                            của bạn
                        </h1>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                            MediSchedule được thành lập với sứ mệnh mang đến dịch vụ chăm sóc sức khỏe chất lượng cao, tiện lợi và
                            dễ tiếp cận cho mọi người dân Việt Nam.
                        </p>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center group">
                                <div className="flex items-center justify-center w-16 h-16 bg-white rounded-2xl mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                                </div>
                                <div className="text-3xl font-bold text-slate-900 mb-2">{stat.number}</div>
                                <div className="text-slate-600">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">Sứ mệnh của chúng tôi</h2>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                Chúng tôi tin rằng mọi người đều xứng đáng được tiếp cận với dịch vụ chăm sóc sức khỏe chất lượng cao
                                một cách thuận tiện và hiệu quả. MediSchedule ra đời để kết nối bệnh nhân với các bác sĩ chuyên khoa
                                uy tín, giúp việc đặt lịch khám trở nên đơn giản và nhanh chóng.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <CheckCircle className="h-6 w-6 text-emerald-500" />
                                    <span className="text-slate-700">Kết nối bệnh nhân với bác sĩ chuyên khoa uy tín</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <CheckCircle className="h-6 w-6 text-emerald-500" />
                                    <span className="text-slate-700">Đơn giản hóa quy trình đặt lịch khám bệnh</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <CheckCircle className="h-6 w-6 text-emerald-500" />
                                    <span className="text-slate-700">Nâng cao chất lượng dịch vụ y tế</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="relative z-10">
                                <Image
                                    src={doctor}
                                    alt="Đội ngũ y bác sĩ"
                                    width={600}
                                    height={500}
                                    className="rounded-2xl shadow-2xl"
                                />
                            </div>
                            <div className="absolute -bottom-6 -right-6 w-full h-full bg-gradient-to-br from-teal-100 to-emerald-100 rounded-2xl -z-10"></div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">Giá trị cốt lõi</h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Những giá trị định hướng mọi hoạt động của chúng tôi
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Card
                                    className={`h-full border-2 ${value.color} hover:shadow-lg transition-all duration-300 hover:-translate-y-2`}
                                >
                                    <CardContent className="p-6 text-center">
                                        <div
                                            className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-lg mb-4`}
                                        >
                                            <value.icon className={`h-8 w-8 ${value.iconColor}`} />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                                        <p className="text-slate-600 leading-relaxed">{value.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">Hành trình phát triển</h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Từ những bước đầu tiên đến thành công ngày hôm nay
                        </p>
                    </motion.div>

                    <div className="max-w-4xl mx-auto">
                        <div className="relative">
                            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-teal-500 to-emerald-500"></div>

                            {milestones.map((milestone, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.2 }}
                                    viewport={{ once: true }}
                                    className={`relative flex items-center mb-12 ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                                >
                                    <div className={`w-1/2 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"}`}>
                                        <Card className="border-2 border-teal-200 hover:shadow-lg transition-all duration-300">
                                            <CardContent className="p-6">
                                                <div className="text-2xl font-bold text-teal-600 mb-2">{milestone.year}</div>
                                                <h3 className="text-xl font-bold text-slate-900 mb-2">{milestone.title}</h3>
                                                <p className="text-slate-600">{milestone.description}</p>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-teal-500 rounded-full border-4 border-white shadow-lg"></div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">Đội ngũ lãnh đạo</h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Những chuyên gia y tế hàng đầu dẫn dắt MediSchedule
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {team.map((member, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                                    <div className="relative">
                                        <Image
                                            src={member.image || "/placeholder.svg"}
                                            alt={member.name}
                                            width={300}
                                            height={300}
                                            className="w-full h-64 object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                        <Badge className="absolute top-4 right-4 bg-teal-500 text-white">{member.specialty}</Badge>
                                    </div>
                                    <CardContent className="p-6">
                                        <h3 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h3>
                                        <p className="text-teal-600 font-semibold mb-2">{member.position}</p>
                                        <p className="text-sm text-slate-500 mb-3">{member.experience}</p>
                                        <p className="text-slate-600 text-sm leading-relaxed">{member.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-teal-600 to-emerald-600">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                            Sẵn sàng trải nghiệm dịch vụ của chúng tôi?
                        </h2>
                        <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
                            Hãy để MediSchedule đồng hành cùng bạn trong hành trình chăm sóc sức khỏe
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/booking">
                                <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-4 text-lg h-14">
                                    Đặt lịch ngay
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/doctors">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-white text-teal-600 hover:bg-white hover:text-teal-600 px-8 py-4 text-lg h-14"
                                >
                                    Tìm bác sĩ
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}