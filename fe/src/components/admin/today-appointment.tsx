"use client"

import { Card, Timeline, Tag, Avatar, Button, Space } from "antd"
import { ClockCircleOutlined, UserOutlined, PhoneOutlined } from "@ant-design/icons"
import {useGetTodayAppointmentsAdminQuery} from "@/api";
import React from "react";

const todayAppointments = [
    {
        time: "08:30",
        patient: "Nguyễn Văn An",
        doctor: "BS. Trần Minh",
        department: "Tim mạch",
        status: "completed",
        phone: "0901234567",
    },
    {
        time: "09:00",
        patient: "Lê Thị Bình",
        doctor: "BS. Nguyễn Hoa",
        department: "Nhi khoa",
        status: "in-progress",
        phone: "0912345678",
    },
    {
        time: "09:30",
        patient: "Trần Văn Cường",
        doctor: "BS. Lê Đức",
        department: "Xương khớp",
        status: "waiting",
        phone: "0923456789",
    },
    {
        time: "10:00",
        patient: "Phạm Thị Dung",
        doctor: "BS. Võ An",
        department: "Da liễu",
        status: "scheduled",
        phone: "0934567890",
    },
    {
        time: "10:30",
        patient: "Hoàng Văn Em",
        doctor: "BS. Trần Minh",
        department: "Tim mạch",
        status: "scheduled",
        phone: "0945678901",
    },
]

const TodayAppointment = () => {
    const {data: appointmentsResponse, isLoading} = useGetTodayAppointmentsAdminQuery()
    const appointments = appointmentsResponse?.data

    if (isLoading || !appointments) {
        return <div>Loading...</div>
    }

    const getStatusColor = (status: string) => {
        const colors = {
            completed: "green",
            confirmed: "orange",
            pending: "default",
            cancelled: "red",
        }
        return colors[status.toLowerCase() as keyof typeof colors] || "default"
    }

    const getStatusText = (status: string) => {
        const texts = {
            completed: "Hoàn thành",
            confirmed: "Đã xác nhận",
            pending: "Chờ khám",
            cancelled: "Đã hủy",
        }
        return texts[status.toLowerCase() as keyof typeof texts] || status
    }

    const timelineItems = appointments.map((apt, index) => ({
        dot: <ClockCircleOutlined style={{ fontSize: "16px", color: "#0d9488" }} />,
        children: (
            <div className="pb-4">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                        <Avatar size="small" icon={<UserOutlined />} className="mr-2" />
                        <div>
                            <div className="font-medium text-gray-900">{apt.patient}</div>
                            <div className="text-sm text-gray-500">
                                {apt.doctor} • {apt.specialty}
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="font-medium text-teal-600 mb-1">{apt.timeSlot}</div>
                        <Tag color={getStatusColor(apt.status)} className="text-xs px-1">
                            {getStatusText(apt.status)}
                        </Tag>
                    </div>
                </div>
                <Space size="small">
                    <Button type="text" size="small" icon={<PhoneOutlined />} className="text-gray-500 hover:text-teal-600">
                        {apt.phone}
                    </Button>
                </Space>
            </div>
        ),
    }))

    return (
        <Card
            title="Lịch hẹn hôm nay"
            variant="borderless"
            className="shadow-sm"
            extra={
                <Button type="link" style={{ color: "#0d9488" }}>
                    Xem tất cả
                </Button>
            }
        >
            <Timeline items={timelineItems} />
        </Card>
    )
}

export default TodayAppointment