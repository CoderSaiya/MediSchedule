"use client"

import { Typography } from "antd"
import { CalendarOutlined } from "@ant-design/icons"

const { Title, Text } = Typography

const DashboardHeader = () => {
    const currentDate = new Date().toLocaleDateString("vi-VN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    })

    return (
        <div className="flex justify-between items-center mb-8 bg-white rounded-xl p-6 shadow-sm border border-teal-100">
            <div>
                <Title level={2} className="mb-1" style={{ color: "#0d9488" }}>
                    mediSchedule Dashboard
                </Title>
                <Text type="secondary" className="text-base">
                    <CalendarOutlined className="mr-2" />
                    {currentDate}
                </Text>
            </div>
        </div>
    )
}

export default DashboardHeader