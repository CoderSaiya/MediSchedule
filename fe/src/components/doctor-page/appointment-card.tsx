"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Clock, Phone, FileText, MoreVertical, CheckCircle, AlertTriangle, Calendar } from "lucide-react"
import {Appointment} from "@/types/appointment";
import {useState} from "react";
import {PrescriptionForm} from "@/components/doctor-page/prescription-form";

interface AppointmentCardProps {
    appointment: Appointment
}

export function AppointmentCard({ appointment }: AppointmentCardProps) {
    const [showPrescriptionForm, setShowPrescriptionForm] = useState(false)

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "confirmed":
                return {
                    color: "bg-blue-100 text-blue-700 border-blue-200",
                    label: "Đã xác nhận",
                    icon: Calendar,
                }
            case "pending":
                return {
                    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
                    label: "Đang chờ",
                    icon: Clock,
                }
            case "completed":
                return {
                    color: "bg-green-100 text-green-700 border-green-200",
                    label: "Hoàn thành",
                    icon: CheckCircle,
                }
            default:
                return {
                    color: "bg-gray-100 text-gray-700 border-gray-200",
                    label: "Không xác định",
                    icon: Clock,
                }
        }
    }

    const statusConfig = getStatusConfig(appointment.status)
    const StatusIcon = statusConfig.icon

    const getActionButtons = () => {
        switch (appointment.status) {
            case "pending":
                return (
                    <>
                        <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                            Bắt đầu khám
                        </Button>
                        <Button size="sm" variant="outline">
                            Hoãn lịch
                        </Button>
                    </>
                )
            case "confirmed":
                return (
                    <>
                        <Button size="sm" className="bg-teal-600 hover:bg-teal-700" onClick={() => setShowPrescriptionForm(true)}>
                            Kê đơn thuốc
                        </Button>
                        {/*<Button size="sm" variant="outline">*/}
                        {/*    Liên hệ*/}
                        {/*</Button>*/}
                    </>
                )
            case "completed":
                return (
                    <>
                        <Button size="sm" variant="outline">
                            <FileText className="h-4 w-4 mr-1" />
                            Xem kết quả
                        </Button>
                        <Button size="sm" variant="outline">
                            Tái khám
                        </Button>
                    </>
                )
            default:
                return null
        }
    }

    return (
        <Card
            className={`hover:shadow-md transition-all duration-200`}
        >
            <CardContent className="p-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                        <Avatar className="h-12 w-12">
                            <AvatarImage alt={appointment.fullName} />
                            <AvatarFallback className="bg-teal-100 text-teal-700">
                                {appointment.fullName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-2">
                            <div className="flex items-center space-x-3">
                                <h4 className="font-semibold text-gray-900">{appointment.fullName}</h4>
                                <Badge className={statusConfig.color}>
                                    <StatusIcon className="h-3 w-3 mr-1" />
                                    {statusConfig.label}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-gray-600">
                                <div className="flex items-center space-x-2">
                                    <Clock className="h-4 w-4 text-gray-400" />
                                    <span>{appointment.appointmentTime}</span>
                                </div>
                                {/*<div className="flex items-center space-x-2">*/}
                                {/*    <User className="h-4 w-4 text-gray-400" />*/}
                                {/*    <span>{appointment.patientAge} tuổi</span>*/}
                                {/*</div>*/}
                                <div className="flex items-center space-x-2">
                                    <Phone className="h-4 w-4 text-gray-400" />
                                    <span>{appointment.phone}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <FileText className="h-4 w-4 text-gray-400" />
                                    <span>{appointment.doctor?.specialty ?? ""}</span>
                                </div>
                            </div>

                            <div className="text-sm">
                                <span className="font-medium text-gray-700">Triệu chứng: </span>
                                <span className="text-gray-600">{appointment.reason}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                        {getActionButtons()}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                    <FileText className="mr-2 h-4 w-4" />
                                    Xem hồ sơ
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Phone className="mr-2 h-4 w-4" />
                                    Gọi điện
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Đổi lịch
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                    <AlertTriangle className="mr-2 h-4 w-4" />
                                    Hủy lịch
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </CardContent>

            {showPrescriptionForm && (
                <PrescriptionForm
                    appointmentId={appointment.id}
                    patientName={appointment.fullName}
                    onClose={() => setShowPrescriptionForm(false)}
                    onSuccess={() => {
                        setShowPrescriptionForm(false)
                    }}
                />
            )}
        </Card>
    )
}