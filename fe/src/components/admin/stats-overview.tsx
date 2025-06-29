"use client"

import React from "react"
import { Row, Col, Card, Statistic } from "antd"
import {
    CalendarOutlined,
    UserOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
} from "@ant-design/icons"
import { useGetAdminStatsQuery } from "@/api"

const StatsOverview = () => {
    const { data: statsResponse, isLoading } = useGetAdminStatsQuery()
    const statsData = statsResponse?.data

    if (isLoading || !statsData) {
        return <div>Loading...</div>
    }

    const stats = [
        {
            title: "Hôm nay",
            value: statsData.totalAppointmentsToday,
            icon: <CalendarOutlined />,
            color: "#0d9488",
            trend: { value: statsData.appointmentsDeltaPercent, isUp: statsData.appointmentsDeltaPercent >= 0 },
            subtitle: "lịch hẹn",
        },
        {
            title: "Đang chờ",
            value: statsData.pendingToday,
            icon: <ClockCircleOutlined />,
            color: "#f59e0b",
            trend: { value: statsData.pendingDeltaPercent, isUp: statsData.pendingDeltaPercent >= 0 },
            subtitle: "bệnh nhân",
        },
        {
            title: "Hoàn thành",
            value: statsData.completedToday,
            icon: <CheckCircleOutlined />,
            color: "#10b981",
            trend: { value: statsData.completedDeltaPercent, isUp: statsData.completedDeltaPercent >= 0 },
            subtitle: "khám xong",
        },
        {
            title: "Bệnh nhân mới",
            value: statsData.newPatientsToday,
            icon: <UserOutlined />,
            color: "#3b82f6",
            trend: { value: statsData.newPatientsDeltaPercent, isUp: statsData.newPatientsDeltaPercent >= 0 },
            subtitle: "lần đầu",
        },
    ]

    return (
        <Row gutter={[24, 24]}>
            {stats.map((stat, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                    <Card
                        variant="borderless"
                        className="shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                        style={{ padding: 24 }}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div
                                className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl"
                                style={{ backgroundColor: stat.color }}
                            >
                                {stat.icon}
                            </div>
                            <div className="text-right">
                                <div className="flex items-center">
                                    {stat.trend.isUp ? (
                                        <ArrowUpOutlined className="text-green-500 mr-1" />
                                    ) : (
                                        <ArrowDownOutlined className="text-red-500 mr-1" />
                                    )}
                                    <span className={`text-sm font-medium ${stat.trend.isUp ? "text-green-500" : "text-red-500"}`}>
                                        {stat.trend.value}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mb-3">
                            <Statistic
                                value={stat.value}
                                valueStyle={{
                                    fontSize: 28,
                                    fontWeight: 700,
                                    color: stat.color,
                                    lineHeight: 1,
                                }}
                            />
                            <p className="text-gray-500 text-sm mt-1 mb-0">
                                {stat.title} {stat.subtitle}
                            </p>
                        </div>
                    </Card>
                </Col>
            ))}
        </Row>
    )
}

export default StatsOverview