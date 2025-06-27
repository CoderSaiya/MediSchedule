"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Star,
    Calendar,
    Search,
    Filter,
    GraduationCap,
    Stethoscope,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import {useGetDoctorsQuery, useGetSpecialtiesQuery} from "@/api";

export default function DoctorsPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedSpecialty, setSelectedSpecialty] = useState("all")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 8

    const {data: doctorResponse} = useGetDoctorsQuery()
    const {data: specialtiesResponse} = useGetSpecialtiesQuery()

    const doctors = doctorResponse?.data || []
    const specialties = specialtiesResponse?.data || []

    const filteredDoctors = doctors.filter((doctor) => {
        const matchesSearch =
            doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesSpecialty = selectedSpecialty === "all" || doctor.specialty === selectedSpecialty

        return matchesSearch && matchesSpecialty
    })

    // Pagination logic
    const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentDoctors = filteredDoctors.slice(startIndex, endIndex)

    const goToPage = (page: number) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    const renderPaginationButtons = () => {
        const buttons = []
        const maxVisiblePages = 5

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                buttons.push(
                    <Button
                        key={i}
                        variant={currentPage === i ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(i)}
                        className={
                            currentPage === i ? "bg-medical-teal-600 text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                        }
                    >
                        {i}
                    </Button>,
                )
            }
        } else {
            // First page
            buttons.push(
                <Button
                    key={1}
                    variant={currentPage === 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(1)}
                    className={
                        currentPage === 1 ? "bg-medical-teal-600 text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }
                >
                    1
                </Button>,
            )

            if (currentPage > 3) {
                buttons.push(
                    <Button key="dots1" variant="ghost" size="sm" disabled>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>,
                )
            }

            // Current page and neighbors
            const start = Math.max(2, currentPage - 1)
            const end = Math.min(totalPages - 1, currentPage + 1)

            for (let i = start; i <= end; i++) {
                buttons.push(
                    <Button
                        key={i}
                        variant={currentPage === i ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(i)}
                        className={
                            currentPage === i ? "bg-medical-teal-600 text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                        }
                    >
                        {i}
                    </Button>,
                )
            }

            if (currentPage < totalPages - 2) {
                buttons.push(
                    <Button key="dots2" variant="ghost" size="sm" disabled>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>,
                )
            }

            // Last page
            if (totalPages > 1) {
                buttons.push(
                    <Button
                        key={totalPages}
                        variant={currentPage === totalPages ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(totalPages)}
                        className={
                            currentPage === totalPages
                                ? "bg-medical-teal-600 text-white"
                                : "border-slate-200 text-slate-600 hover:bg-slate-50"
                        }
                    >
                        {totalPages}
                    </Button>,
                )
            }
        }

        return buttons
    }

    return (
        <div className="m-20">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-medical-teal-100 rounded-full mb-6">
                        <Stethoscope className="h-8 w-8 text-medical-teal-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Đội ngũ bác sĩ chuyên khoa</h1>
                    <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                        Tìm kiếm và đặt lịch với các bác sĩ chuyên khoa hàng đầu
                    </p>
                </div>

                {/* Search and Filter */}
                <Card className="mb-8 border-0 shadow-sm">
                    <CardContent className="p-6">
                        <div className="grid md:grid-cols-4 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Tìm kiếm bác sĩ, chuyên khoa..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 border-slate-200 focus:border-medical-teal-500"
                                />
                            </div>

                            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                                <SelectTrigger className="border-slate-200 focus:border-medical-teal-500">
                                    <SelectValue placeholder="Chọn chuyên khoa" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả chuyên khoa</SelectItem>
                                    {specialties.map((specialty) => (
                                        <SelectItem key={specialty.title} value={specialty.title}>
                                            {specialty.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Button variant="outline" className="w-full border-slate-200 hover:bg-slate-50">
                                <Filter className="h-4 w-4 mr-2" />
                                Bộ lọc
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Results Info */}
                <div className="flex justify-between items-center mb-6">
                    <p className="text-slate-600">
                        Hiển thị <span className="font-semibold">{startIndex + 1}</span> -{" "}
                        <span className="font-semibold">{Math.min(endIndex, filteredDoctors.length)}</span> trong tổng số{" "}
                        <span className="font-semibold text-medical-teal-600">{filteredDoctors.length}</span> bác sĩ
                    </p>
                    <p className="text-sm text-slate-500">
                        Trang {currentPage} / {totalPages}
                    </p>
                </div>

                {/* Doctors Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {currentDoctors.map((doctor, index) => (
                        <motion.div
                            key={doctor.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border border-slate-200 bg-white group cursor-pointer">
                                <CardContent className="p-0">
                                    <div className="flex">
                                        {/* Doctor Image */}
                                        <div className="w-32 h-32 flex-shrink-0 relative overflow-hidden bg-slate-100">
                                            <Avatar className="w-full h-full rounded-none">
                                                <AvatarImage
                                                    src={doctor.image}
                                                    alt={doctor.name}
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <AvatarFallback className="rounded-none bg-medical-teal-100 text-medical-teal-700 text-lg font-semibold">
                                                    {doctor.name
                                                        .split(" ")
                                                        .slice(-2)
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </AvatarFallback>
                                            </Avatar>

                                            {/* Status Badge */}
                                            <div className="absolute top-2 right-2">
                                                {doctor.available ? (
                                                    <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                                                ) : (
                                                    <div className="w-3 h-3 bg-gray-400 rounded-full border-2 border-white shadow-sm"></div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Doctor Info */}
                                        <div className="flex-1 p-4 flex flex-col justify-between">
                                            <div className="space-y-2">
                                                {/* Name */}
                                                <h3 className="text-lg font-bold text-teal-500 group-hover:text-teal-600 transition-colors">
                                                    {doctor.name}
                                                </h3>

                                                {/* Title */}
                                                <div className="flex items-center text-slate-600 text-sm">
                                                    <GraduationCap className="h-4 w-4 mr-2 text-slate-400" />
                                                    <span>{doctor.levelEducation}</span>
                                                </div>

                                                {/* Specialty */}
                                                <div className="flex items-center text-slate-700 text-sm">
                                                    <Stethoscope className="h-4 w-4 mr-2 text-medical-teal-500" />
                                                    <span>{doctor.specialty}</span>
                                                </div>
                                            </div>

                                            {/* Bottom Section */}
                                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                                                {/* Rating */}
                                                <div className="flex items-center space-x-1">
                                                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                                    <span className="text-sm font-medium text-slate-700">{doctor.rating}</span>
                                                    <span className="text-xs text-slate-500">({doctor.experience})</span>
                                                </div>

                                                {/* Book Button */}
                                                <Link href="/booking">
                                                    <Button
                                                        size="sm"
                                                        className={`text-xs px-3 py-1 ${
                                                            doctor.available
                                                                ? "bg-medical-teal-600 hover:bg-medical-teal-700 text-white"
                                                                : "bg-slate-200 text-slate-500 cursor-not-allowed"
                                                        }`}
                                                        disabled={!doctor.available}
                                                    >
                                                        <Calendar className="h-3 w-3 mr-1" />
                                                        {doctor.available ? "Đặt lịch" : "Hết lịch"}
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Trước
                        </Button>

                        <div className="flex space-x-1">{renderPaginationButtons()}</div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                        >
                            Sau
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}

                {/* No Results */}
                {filteredDoctors.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="h-10 w-10 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-3">Không tìm thấy bác sĩ phù hợp</h3>
                        <p className="text-slate-600 mb-6">Vui lòng thử lại với từ khóa khác hoặc điều chỉnh bộ lọc</p>
                        <Button
                            onClick={() => {
                                setSearchTerm("")
                                setSelectedSpecialty("all")
                                setCurrentPage(1)
                            }}
                            variant="outline"
                            className="border-medical-teal-200 text-medical-teal-700 hover:bg-medical-teal-50"
                        >
                            Xóa bộ lọc
                        </Button>
                    </div>
                )}
            </motion.div>
        </div>
    )
}