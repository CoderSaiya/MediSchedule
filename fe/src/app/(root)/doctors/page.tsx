"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Calendar, Search, Filter } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

export default function DoctorsPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedSpecialty, setSelectedSpecialty] = useState("all")
    const [selectedLocation, setSelectedLocation] = useState("all")
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN').format(amount)
    }

    const doctors = [
        {
            id: 1,
            name: "BS. Nguyễn Văn An",
            specialty: "Tim mạch",
            experience: "15 năm kinh nghiệm",
            rating: 4.9,
            reviews: 127,
            location: "Bệnh viện Đa khoa Trung ương",
            image: "/placeholder.svg?height=300&width=300",
            available: true,
            education: "Tiến sĩ Y khoa - Đại học Y Hà Nội",
            languages: ["Tiếng Việt", "English"],
            consultationFee: 200000,
        },
        {
            id: 2,
            name: "BS. Trần Thị Bình",
            specialty: "Nhi khoa",
            experience: "12 năm kinh nghiệm",
            rating: 4.8,
            reviews: 98,
            location: "Bệnh viện Nhi Trung ương",
            image: "/placeholder.svg?height=300&width=300",
            available: true,
            education: "Thạc sĩ Y khoa - Đại học Y Dược TP.HCM",
            languages: ["Tiếng Việt"],
            consultationFee: 180000,
        },
        {
            id: 3,
            name: "BS. Lê Minh Cường",
            specialty: "Thần kinh",
            experience: "18 năm kinh nghiệm",
            rating: 4.9,
            reviews: 156,
            location: "Bệnh viện Bach Mai",
            image: "/placeholder.svg?height=300&width=300",
            available: false,
            education: "Tiến sĩ Y khoa - Đại học Y Hà Nội",
            languages: ["Tiếng Việt", "English", "Français"],
            consultationFee: 250000,
        },
        {
            id: 4,
            name: "BS. Phạm Thị Dung",
            specialty: "Mắt",
            experience: "10 năm kinh nghiệm",
            rating: 4.7,
            reviews: 89,
            location: "Bệnh viện Mắt Trung ương",
            image: "/placeholder.svg?height=300&width=300",
            available: true,
            education: "Thạc sĩ Y khoa - Đại học Y Hà Nội",
            languages: ["Tiếng Việt", "English"],
            consultationFee: 170000,
        },
        {
            id: 5,
            name: "BS. Hoàng Văn Em",
            specialty: "Xương khớp",
            experience: "14 năm kinh nghiệm",
            rating: 4.8,
            reviews: 112,
            location: "Bệnh viện Việt Đức",
            image: "/placeholder.svg?height=300&width=300",
            available: true,
            education: "Tiến sĩ Y khoa - Đại học Y Hà Nội",
            languages: ["Tiếng Việt", "English"],
            consultationFee: 220000,
        },
        {
            id: 6,
            name: "BS. Vũ Thị Phương",
            specialty: "Da liễu",
            experience: "8 năm kinh nghiệm",
            rating: 4.6,
            reviews: 67,
            location: "Bệnh viện Da liễu Trung ương",
            image: "/placeholder.svg?height=300&width=300",
            available: true,
            education: "Thạc sĩ Y khoa - Đại học Y Dược TP.HCM",
            languages: ["Tiếng Việt"],
            consultationFee: 160000,
        },
    ]

    const specialties = [
        "Tim mạch",
        "Nhi khoa",
        "Thần kinh",
        "Mắt",
        "Xương khớp",
        "Da liễu",
        "Tai mũi họng",
        "Nội tổng quát",
    ]
    const locations = [
        "Bệnh viện Đa khoa Trung ương",
        "Bệnh viện Nhi Trung ương",
        "Bệnh viện Bach Mai",
        "Bệnh viện Mắt Trung ương",
        "Bệnh viện Việt Đức",
        "Bệnh viện Da liễu Trung ương",
    ]

    const filteredDoctors = doctors.filter((doctor) => {
        const matchesSearch =
            doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesSpecialty = selectedSpecialty === "all" || doctor.specialty === selectedSpecialty
        const matchesLocation = selectedLocation === "all" || doctor.location === selectedLocation

        return matchesSearch && matchesSpecialty && matchesLocation
    })

    if (!isClient) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="m-10 mx-40">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Đội ngũ bác sĩ chuyên khoa</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Tìm kiếm và đặt lịch với các bác sĩ chuyên khoa hàng đầu, được đào tạo bài bản và có nhiều năm kinh nghiệm
                    </p>
                </div>

                {/* Search and Filter */}
                <Card className="mb-8">
                    <CardContent className="p-6">
                        <div className="grid md:grid-cols-4 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Tìm kiếm bác sĩ, chuyên khoa..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn chuyên khoa" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả chuyên khoa</SelectItem>
                                    {specialties.map((specialty) => (
                                        <SelectItem key={specialty} value={specialty}>
                                            {specialty}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn bệnh viện" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả bệnh viện</SelectItem>
                                    {locations.map((location) => (
                                        <SelectItem key={location} value={location}>
                                            {location}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Button variant="outline" className="w-full">
                                <Filter className="h-4 w-4 mr-2" />
                                Bộ lọc
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Results Count */}
                <div className="mb-6">
                    <p className="text-gray-600">
                        Tìm thấy <span className="font-semibold">{filteredDoctors.length}</span> bác sĩ phù hợp
                    </p>
                </div>

                {/* Doctors Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDoctors.map((doctor, index) => (
                        <motion.div
                            key={doctor.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
                                <div className="relative">
                                    <Image
                                        src={doctor.image || "/placeholder.svg"}
                                        alt={doctor.name}
                                        width={300}
                                        height={200}
                                        className="w-full h-48 object-cover"
                                    />
                                    {doctor.available ? (
                                        <Badge className="absolute top-4 right-4 bg-green-500 hover:bg-green-600">Có lịch</Badge>
                                    ) : (
                                        <Badge className="absolute top-4 right-4 bg-gray-500">Hết lịch</Badge>
                                    )}
                                </div>

                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-1">{doctor.name}</h3>
                                            <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                                            <p className="text-gray-600 text-sm">{doctor.experience}</p>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                                <span className="ml-1 text-sm font-medium">{doctor.rating}</span>
                                                <span className="text-gray-500 text-sm ml-1">({doctor.reviews})</span>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-600">Phí khám</p>
                                                <p className="font-semibold text-blue-600">{formatCurrency(doctor.consultationFee)} VNĐ</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center text-gray-600 text-sm">
                                                <MapPin className="h-4 w-4 mr-2" />
                                                <span>{doctor.location}</span>
                                            </div>
                                            <p className="text-gray-600 text-sm">{doctor.education}</p>
                                            <div className="flex flex-wrap gap-1">
                                                {doctor.languages.map((language) => (
                                                    <Badge key={language} variant="secondary" className="text-xs">
                                                        {language}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="pt-4 space-y-2">
                                            <Link href="/booking" className="block">
                                                <Button
                                                    className="w-full"
                                                    disabled={!doctor.available}
                                                    variant={doctor.available ? "default" : "secondary"}
                                                >
                                                    <Calendar className="h-4 w-4 mr-2" />
                                                    {doctor.available ? "Đặt lịch khám" : "Hết lịch"}
                                                </Button>
                                            </Link>
                                            <Button variant="outline" className="w-full">
                                                Xem chi tiết
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {filteredDoctors.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy bác sĩ</h3>
                        <p className="text-gray-600">Vui lòng thử lại với từ khóa khác hoặc điều chỉnh bộ lọc</p>
                    </div>
                )}
            </motion.div>
        </div>
    )
}