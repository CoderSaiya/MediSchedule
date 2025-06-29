"use client"
import { useState, useEffect } from "react"
import { Col, Row, Spin } from "antd"
import DashboardHeader from "./dashboard-header"
import StatsOverview from "./stats-overview"
import AppointmentChart from "./appointment-chart"
import TodayAppointment from "./today-appointment"
import SpecialtyStats from "./specialty-stats"

const AdminDashboard = () => {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false)
        }, 1000)
        return () => clearTimeout(timer)
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spin size="large" />
            </div>
        )
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <DashboardHeader />

            {/* Top Stats Row */}
            <StatsOverview />

            {/* Main Content Grid */}
            <Row gutter={[24, 24]} className="mt-6">
                {/* Left Column */}
                <Col xs={24} lg={16}>
                    <Row gutter={[24, 24]}>
                        {/* Appointment Trends Chart */}
                        <Col span={24}>
                            <AppointmentChart />
                        </Col>

                        {/* Department Performance */}
                        <Col span={24}>
                            <SpecialtyStats />
                        </Col>
                    </Row>
                </Col>

                {/* Right Column */}
                <Col xs={24} lg={8}>
                    <Row gutter={[24, 24]}>
                        {/* Today's Schedule */}
                        <Col span={24}>
                            <TodayAppointment />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default AdminDashboard