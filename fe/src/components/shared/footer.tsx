import { Calendar, Phone, Mail } from "lucide-react"
import Link from "next/link"

export function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-12 max-w-7xl">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600">
                                <Calendar className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold">MediSchedule</span>
                        </div>
                        <p className="text-gray-400 mb-4">Hệ thống đặt lịch khám bệnh trực tuyến hàng đầu Việt Nam</p>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-gray-400">
                                <Phone className="h-4 w-4" />
                                <span>1900 1234</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-400">
                                <Mail className="h-4 w-4" />
                                <span>sonysam.contacts@gmail.com</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Dịch vụ</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li>
                                <Link href="/services" className="hover:text-white transition-colors">
                                    Đặt lịch khám
                                </Link>
                            </li>
                            <li>
                                <Link href="/doctors" className="hover:text-white transition-colors">
                                    Tìm bác sĩ
                                </Link>
                            </li>
                            <li>
                                <Link href="/specialties" className="hover:text-white transition-colors">
                                    Chuyên khoa
                                </Link>
                            </li>
                            <li>
                                <Link href="/health-check" className="hover:text-white transition-colors">
                                    Khám sức khỏe
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Hỗ trợ</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li>
                                <Link href="/help" className="hover:text-white transition-colors">
                                    Trung tâm trợ giúp
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="hover:text-white transition-colors">
                                    Câu hỏi thường gặp
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-white transition-colors">
                                    Liên hệ
                                </Link>
                            </li>
                            <li>
                                <Link href="/feedback" className="hover:text-white transition-colors">
                                    Góp ý
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Về chúng tôi</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li>
                                <Link href="/about" className="hover:text-white transition-colors">
                                    Giới thiệu
                                </Link>
                            </li>
                            <li>
                                <Link href="/news" className="hover:text-white transition-colors">
                                    Tin tức
                                </Link>
                            </li>
                            <li>
                                <Link href="/careers" className="hover:text-white transition-colors">
                                    Tuyển dụng
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="hover:text-white transition-colors">
                                    Chính sách bảo mật
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; 2025 MediSchedule. Tất cả quyền được bảo lưu.</p>
                </div>
            </div>
        </footer>
    )
}