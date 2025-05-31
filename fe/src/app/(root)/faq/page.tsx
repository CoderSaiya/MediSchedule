"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Search,
    ChevronDown,
    ChevronUp,
    HelpCircle,
    Phone,
    MessageCircle,
    Calendar,
    CreditCard,
    Users,
    Shield,
    Star,
    CheckCircle,
    AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function FAQPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [expandedItems, setExpandedItems] = useState<number[]>([])

    const categories = [
        { id: "all", name: "Tất cả", icon: HelpCircle, count: 24 },
        { id: "booking", name: "Đặt lịch khám", icon: Calendar, count: 8 },
        { id: "payment", name: "Thanh toán", icon: CreditCard, count: 6 },
        { id: "doctors", name: "Bác sĩ & Dịch vụ", icon: Users, count: 5 },
        { id: "account", name: "Tài khoản", icon: Shield, count: 3 },
        { id: "technical", name: "Kỹ thuật", icon: MessageCircle, count: 2 },
    ]

    const faqs = [
        {
            id: 1,
            category: "booking",
            question: "Làm thế nào để đặt lịch khám bệnh?",
            answer:
                "Để đặt lịch khám bệnh, bạn có thể thực hiện theo các bước sau:\n\n1. Truy cập trang web MediSchedule hoặc mở ứng dụng\n2. Chọn 'Đặt lịch ngay' trên trang chủ\n3. Chọn chuyên khoa và bác sĩ phù hợp\n4. Chọn ngày và giờ khám\n5. Điền thông tin cá nhân\n6. Xác nhận và thanh toán\n\nSau khi hoàn tất, bạn sẽ nhận được email xác nhận và phiếu khám.",
            tags: ["đặt lịch", "hướng dẫn", "bước đầu"],
            helpful: 156,
            priority: "high",
        },
        {
            id: 2,
            category: "booking",
            question: "Có thể hủy hoặc đổi lịch hẹn không?",
            answer:
                "Có, bạn hoàn toàn có thể hủy hoặc đổi lịch hẹn:\n\n**Hủy lịch hẹn:**\n- Hủy trước 24h: Hoàn tiền 100%\n- Hủy trước 12h: Hoàn tiền 50%\n- Hủy trong vòng 12h: Không hoàn tiền\n\n**Đổi lịch hẹn:**\n- Miễn phí đổi lịch 1 lần\n- Phải đổi trước ít nhất 6 giờ\n- Liên hệ hotline 1900 1234 để được hỗ trợ",
            tags: ["hủy lịch", "đổi lịch", "chính sách"],
            helpful: 89,
            priority: "high",
        },
        {
            id: 3,
            category: "payment",
            question: "Các hình thức thanh toán nào được hỗ trợ?",
            answer:
                "MediSchedule hỗ trợ nhiều hình thức thanh toán tiện lợi:\n\n**Thanh toán trực tuyến:**\n- Ví MoMo\n- Thẻ ATM nội địa\n- Thẻ Visa/Mastercard\n- Chuyển khoản ngân hàng\n\n**Thanh toán tại cơ sở y tế:**\n- Tiền mặt\n- Thẻ ATM\n- Quẹt thẻ tín dụng\n\nTất cả giao dịch đều được mã hóa SSL bảo mật tuyệt đối.",
            tags: ["thanh toán", "momo", "thẻ ngân hàng"],
            helpful: 134,
            priority: "high",
        },
        {
            id: 4,
            category: "payment",
            question: "Có thể hoàn tiền không? Quy trình như thế nào?",
            answer:
                "Có, MediSchedule hỗ trợ hoàn tiền theo chính sách:\n\n**Điều kiện hoàn tiền:**\n- Hủy lịch đúng thời hạn quy định\n- Bác sĩ hủy lịch đột xuất\n- Lỗi từ hệ thống\n\n**Quy trình hoàn tiền:**\n1. Gửi yêu cầu qua email hoặc hotline\n2. Cung cấp mã đặt lịch và lý do\n3. Xử lý trong 3-5 ngày làm việc\n4. Tiền được hoàn về tài khoản gốc\n\n**Thời gian hoàn tiền:** 5-7 ngày làm việc tùy ngân hàng.",
            tags: ["hoàn tiền", "chính sách", "quy trình"],
            helpful: 67,
            priority: "medium",
        },
        {
            id: 5,
            category: "doctors",
            question: "Làm sao để chọn bác sĩ phù hợp?",
            answer:
                "Để chọn bác sĩ phù hợp, bạn có thể tham khảo:\n\n**Thông tin bác sĩ:**\n- Chuyên khoa và kinh nghiệm\n- Học vấn và chứng chỉ\n- Đánh giá từ bệnh nhân\n- Lịch khám và thời gian\n\n**Gợi ý lựa chọn:**\n- Đọc đánh giá và nhận xét\n- Xem video giới thiệu bác sĩ\n- Tham khảo bạn bè, người thân\n- Liên hệ tư vấn viên để được hỗ trợ\n\nMọi bác sĩ trên MediSchedule đều được kiểm định chất lượng nghiêm ngặt.",
            tags: ["chọn bác sĩ", "tư vấn", "chất lượng"],
            helpful: 98,
            priority: "medium",
        },
        {
            id: 6,
            category: "booking",
            question: "Thời gian xác nhận lịch hẹn là bao lâu?",
            answer:
                "Thời gian xác nhận lịch hẹn phụ thuộc vào hình thức đặt:\n\n**Đặt lịch trực tuyến:**\n- Tự động xác nhận ngay sau thanh toán\n- Nhận email/SMS xác nhận trong 1-2 phút\n- Phiếu khám được gửi kèm\n\n**Đặt lịch qua hotline:**\n- Xác nhận ngay trong cuộc gọi\n- Email xác nhận trong 5-10 phút\n\n**Trường hợp đặc biệt:**\n- Lịch khám cấp cứu: Xác nhận trong 15 phút\n- Lịch khám cuối tuần: Có thể chậm hơn 30 phút",
            tags: ["xác nhận", "thời gian", "email"],
            helpful: 76,
            priority: "medium",
        },
        {
            id: 7,
            category: "account",
            question: "Làm thế nào để tạo tài khoản?",
            answer:
                "Tạo tài khoản MediSchedule rất đơn giản:\n\n**Cách 1: Đăng ký trực tiếp**\n1. Nhấn 'Đăng ký' trên trang chủ\n2. Điền thông tin: họ tên, email, số điện thoại\n3. Tạo mật khẩu mạnh\n4. Xác thực OTP qua SMS\n5. Hoàn tất đăng ký\n\n**Cách 2: Đăng ký khi đặt lịch**\n- Hệ thống tự động tạo tài khoản\n- Thông tin từ form đặt lịch\n- Mật khẩu gửi qua email\n\n**Lợi ích có tài khoản:**\n- Quản lý lịch hẹn dễ dàng\n- Lưu thông tin bác sĩ yêu thích\n- Nhận thông báo và ưu đãi",
            tags: ["tài khoản", "đăng ký", "hướng dẫn"],
            helpful: 45,
            priority: "low",
        },
        {
            id: 8,
            category: "technical",
            question: "Tôi không nhận được email xác nhận, phải làm sao?",
            answer:
                "Nếu không nhận được email xác nhận, hãy thử:\n\n**Kiểm tra ngay:**\n1. Thư mục Spam/Junk\n2. Thư mục Promotions (Gmail)\n3. Địa chỉ email đã nhập đúng chưa\n\n**Các bước khắc phục:**\n1. Đợi thêm 5-10 phút\n2. Kiểm tra kết nối internet\n3. Thêm support@medischedule.vn vào danh bạ\n4. Yêu cầu gửi lại email\n\n**Liên hệ hỗ trợ:**\n- Hotline: 1900 1234\n- Email: support@medischedule.vn\n- Live chat trên website\n\nChúng tôi sẽ hỗ trợ bạn ngay lập tức!",
            tags: ["email", "kỹ thuật", "hỗ trợ"],
            helpful: 23,
            priority: "low",
        },
    ]

    const toggleExpanded = (id: number) => {
        setExpandedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
    }

    const filteredFAQs = faqs.filter((faq) => {
        const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory
        const matchesSearch =
            searchTerm === "" ||
            faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

        return matchesCategory && matchesSearch
    })

    const popularFAQs = faqs.sort((a, b) => b.helpful - a.helpful).slice(0, 3)

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
                        <Badge className="bg-teal-100 text-teal-700 px-6 py-3 mb-6 border-0 text-lg">Câu hỏi thường gặp</Badge>
                        <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-6">
                            Tìm{" "}
                            <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                  câu trả lời
                </span>{" "}
                            nhanh chóng
                        </h1>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
                            Khám phá những câu hỏi thường gặp và tìm giải pháp cho mọi thắc mắc của bạn về dịch vụ MediSchedule.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    placeholder="Tìm kiếm câu hỏi, từ khóa..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-12 pr-4 py-4 text-lg border-2 border-teal-200 focus:border-teal-500 rounded-xl"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Popular FAQs */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Câu hỏi phổ biến nhất</h2>
                        <p className="text-slate-600">Những thắc mắc được quan tâm nhiều nhất từ người dùng</p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {popularFAQs.map((faq, index) => (
                            <motion.div
                                key={faq.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-2 border-2 border-teal-100">
                                    <CardHeader>
                                        <div className="flex items-center justify-between mb-2">
                                            <Badge className="bg-teal-100 text-teal-700">
                                                {categories.find((cat) => cat.id === faq.category)?.name}
                                            </Badge>
                                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                                <span>{faq.helpful}</span>
                                            </div>
                                        </div>
                                        <CardTitle className="text-lg leading-tight">{faq.question}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">{faq.answer.split("\n")[0]}</p>
                                        <Button
                                            variant="outline"
                                            className="w-full mt-4 border-teal-200 text-teal-700 hover:bg-teal-50"
                                            onClick={() => toggleExpanded(faq.id)}
                                        >
                                            Xem chi tiết
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories & FAQ List */}
            <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-4 gap-8">
                        {/* Categories Sidebar */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="lg:col-span-1"
                        >
                            <Card className="sticky top-8">
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <HelpCircle className="h-5 w-5 mr-2 text-teal-600" />
                                        Danh mục
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {categories.map((category) => (
                                        <button
                                            key={category.id}
                                            onClick={() => setSelectedCategory(category.id)}
                                            className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200 ${
                                                selectedCategory === category.id
                                                    ? "bg-teal-100 text-teal-700 border-2 border-teal-300"
                                                    : "hover:bg-gray-100 border-2 border-transparent"
                                            }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <category.icon className="h-5 w-5" />
                                                <span className="font-medium">{category.name}</span>
                                            </div>
                                            <Badge variant="secondary" className="text-xs">
                                                {category.count}
                                            </Badge>
                                        </button>
                                    ))}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* FAQ List */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="lg:col-span-3"
                        >
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                    {selectedCategory === "all"
                                        ? "Tất cả câu hỏi"
                                        : categories.find((cat) => cat.id === selectedCategory)?.name}
                                </h2>
                                <p className="text-slate-600">
                                    Tìm thấy {filteredFAQs.length} câu hỏi
                                    {searchTerm && ` cho "${searchTerm}"`}
                                </p>
                            </div>

                            <div className="space-y-4">
                                {filteredFAQs.length === 0 ? (
                                    <Card className="border-2 border-gray-200">
                                        <CardContent className="p-12 text-center">
                                            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                            <h3 className="text-xl font-semibold text-gray-600 mb-2">Không tìm thấy câu hỏi nào</h3>
                                            <p className="text-gray-500 mb-6">Thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác</p>
                                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                                <Button onClick={() => setSearchTerm("")} variant="outline">
                                                    Xóa tìm kiếm
                                                </Button>
                                                <Link href="/contact">
                                                    <Button className="bg-teal-600 hover:bg-teal-700">Liên hệ hỗ trợ</Button>
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    filteredFAQs.map((faq, index) => (
                                        <motion.div
                                            key={faq.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: index * 0.05 }}
                                            viewport={{ once: true }}
                                        >
                                            <Card className="border-2 border-gray-100 hover:border-teal-200 transition-all duration-300">
                                                <CardHeader className="cursor-pointer" onClick={() => toggleExpanded(faq.id)}>
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center space-x-2 mb-2">
                                                                <Badge
                                                                    className={`text-xs ${
                                                                        faq.priority === "high"
                                                                            ? "bg-red-100 text-red-700"
                                                                            : faq.priority === "medium"
                                                                                ? "bg-yellow-100 text-yellow-700"
                                                                                : "bg-gray-100 text-gray-700"
                                                                    }`}
                                                                >
                                                                    {categories.find((cat) => cat.id === faq.category)?.name}
                                                                </Badge>
                                                                {faq.priority === "high" && (
                                                                    <Badge className="bg-red-100 text-red-700 text-xs">Phổ biến</Badge>
                                                                )}
                                                            </div>
                                                            <CardTitle className="text-lg leading-tight pr-4">{faq.question}</CardTitle>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                                                <span>{faq.helpful}</span>
                                                            </div>
                                                            {expandedItems.includes(faq.id) ? (
                                                                <ChevronUp className="h-5 w-5 text-gray-400" />
                                                            ) : (
                                                                <ChevronDown className="h-5 w-5 text-gray-400" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </CardHeader>

                                                {expandedItems.includes(faq.id) && (
                                                    <CardContent className="pt-0">
                                                        <div className="bg-gray-50 p-6 rounded-lg">
                                                            <div className="prose prose-sm max-w-none">
                                                                {faq.answer.split("\n").map((paragraph, pIndex) => (
                                                                    <p key={pIndex} className="mb-3 last:mb-0 text-slate-700 leading-relaxed">
                                                                        {paragraph}
                                                                    </p>
                                                                ))}
                                                            </div>

                                                            {/* Tags */}
                                                            <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-gray-200">
                                                                <span className="text-sm text-gray-500 mr-2">Từ khóa:</span>
                                                                {faq.tags.map((tag, tagIndex) => (
                                                                    <Badge
                                                                        key={tagIndex}
                                                                        variant="secondary"
                                                                        className="text-xs cursor-pointer hover:bg-teal-100"
                                                                        onClick={() => setSearchTerm(tag)}
                                                                    >
                                                                        {tag}
                                                                    </Badge>
                                                                ))}
                                                            </div>

                                                            {/* Helpful Actions */}
                                                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                                                                <div className="flex items-center space-x-4">
                                                                    <span className="text-sm text-gray-600">Câu trả lời này có hữu ích không?</span>
                                                                    <div className="flex items-center space-x-2">
                                                                        <Button
                                                                            size="sm"
                                                                            variant="outline"
                                                                            className="text-green-600 border-green-200 hover:bg-green-50"
                                                                        >
                                                                            <CheckCircle className="h-4 w-4 mr-1" />
                                                                            Có
                                                                        </Button>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="outline"
                                                                            className="text-red-600 border-red-200 hover:bg-red-50"
                                                                        >
                                                                            <AlertCircle className="h-4 w-4 mr-1" />
                                                                            Không
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center space-x-1 text-sm text-gray-500">
                                                                    <Users className="h-4 w-4" />
                                                                    <span>{faq.helpful} người thấy hữu ích</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                )}
                                            </Card>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Contact Support */}
            <section className="py-20 bg-gradient-to-r from-teal-600 to-emerald-600">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Vẫn chưa tìm thấy câu trả lời?</h2>
                        <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
                            Đội ngũ hỗ trợ chuyên nghiệp của chúng tôi luôn sẵn sàng giúp đỡ bạn 24/7
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/contact">
                                <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-4 text-lg h-14">
                                    <MessageCircle className="mr-2 h-5 w-5" />
                                    Liên hệ hỗ trợ
                                </Button>
                            </Link>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-white text-teal-600 hover:bg-white hover:text-teal-600 px-8 py-4 text-lg h-14"
                            >
                                <Phone className="mr-2 h-5 w-5" />
                                Gọi 1900 1234
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}