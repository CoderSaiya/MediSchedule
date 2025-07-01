"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Search, Filter, ChevronRight } from "lucide-react"
import type { Hospital, HospitalSearchFilters } from "@/types/hospital"
import { HospitalMap } from "./hospital-map"

interface HospitalSelectorProps {
    hospitals: Hospital[]
    selectedHospital?: Hospital
    onHospitalSelect: (hospital: Hospital) => void
    onSearch?: (filters: HospitalSearchFilters) => void
}

export function HospitalSelector({ hospitals, selectedHospital, onHospitalSelect, onSearch }: HospitalSelectorProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedSpecialty, setSelectedSpecialty] = useState("all")
    const [showMap, setShowMap] = useState(false)
    const [filteredHospitals, setFilteredHospitals] = useState(hospitals)

    // Get unique specialties from all hospitals
    const allSpecialties = Array.from(new Set(hospitals.flatMap((hospital) => hospital.specialties))).sort()

    useEffect(() => {
        let filtered = hospitals

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(
                (hospital) =>
                    hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    hospital.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    hospital.specialties.some((spec) => spec.toLowerCase().includes(searchQuery.toLowerCase())),
            )
        }

        // Filter by specialty
        if (selectedSpecialty !== "all") {
            filtered = filtered.filter((hospital) => hospital.specialties.includes(selectedSpecialty))
        }

        setFilteredHospitals(filtered)
    }, [searchQuery, selectedSpecialty, hospitals])

    const handleSearch = () => {
        if (onSearch) {
            onSearch({
                query: searchQuery,
                specialty: selectedSpecialty,
            })
        }
    }

    return (
        <div className="space-y-6">
            {/* Search and Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Search className="h-5 w-5" />
                        Tìm kiếm bệnh viện
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Tìm theo tên bệnh viện, địa chỉ..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Chọn chuyên khoa" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả chuyên khoa</SelectItem>
                                {allSpecialties.map((specialty) => (
                                    <SelectItem key={specialty} value={specialty}>
                                        {specialty}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button onClick={handleSearch} variant="outline">
                            <Filter className="h-4 w-4 mr-2" />
                            Lọc
                        </Button>
                    </div>

                    <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">Tìm thấy {filteredHospitals.length} bệnh viện</p>
                        <Button variant="outline" size="sm" onClick={() => setShowMap(!showMap)}>
                            <MapPin className="h-4 w-4 mr-2" />
                            {showMap ? "Ẩn bản đồ" : "Xem bản đồ"}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Map View */}
            {showMap && (
                <Card>
                    <CardContent className="p-0">
                        <HospitalMap
                            hospitals={filteredHospitals}
                            selectedHospital={selectedHospital}
                            onHospitalSelect={onHospitalSelect}
                        />
                    </CardContent>
                </Card>
            )}

            {/* Hospital List */}
            <div className="grid gap-4">
                {filteredHospitals.map((hospital) => (
                    <Card
                        key={hospital.id}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                            selectedHospital?.id === hospital.id ? "ring-2 ring-teal-500 bg-teal-50" : "hover:bg-gray-50"
                        }`}
                        onClick={() => onHospitalSelect(hospital)}
                    >
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900">{hospital.name}</h3>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <MapPin className="h-4 w-4" />
                                            <span className="text-sm">{hospital.address}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Phone className="h-4 w-4" />
                                            <span className="text-sm">{hospital.phone}</span>
                                        </div>
                                    </div>

                                    {/* Specialties */}
                                    <div className="flex flex-wrap gap-1">
                                        {hospital.specialties.slice(0, 3).map((specialty) => (
                                            <Badge key={specialty} variant="secondary" className="text-xs">
                                                {specialty}
                                            </Badge>
                                        ))}
                                        {hospital.specialties.length > 3 && (
                                            <Badge variant="secondary" className="text-xs">
                                                +{hospital.specialties.length - 3} chuyên khoa
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <ChevronRight className="h-5 w-5 text-gray-400 ml-4" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredHospitals.length === 0 && (
                <Card>
                    <CardContent className="text-center py-12">
                        <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy bệnh viện</h3>
                        <p className="text-gray-600">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}