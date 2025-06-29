"use client"

import { Card, Select, Row, Col, Statistic } from "antd"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import {useEffect, useState} from "react";
import {useGetAppointmentStatsQuery} from "@/api";

const { Option } = Select

const weeklyData = [
    { name: "T2", appointments: 24, completed: 20, cancelled: 2 },
    { name: "T3", appointments: 32, completed: 28, cancelled: 1 },
    { name: "T4", appointments: 28, completed: 25, cancelled: 3 },
    { name: "T5", appointments: 35, completed: 32, cancelled: 2 },
    { name: "T6", appointments: 30, completed: 28, cancelled: 1 },
    { name: "T7", appointments: 18, completed: 16, cancelled: 1 },
    { name: "CN", appointments: 12, completed: 11, cancelled: 0 },
]

const hourlyData = [
    { time: "8:00", count: 5 },
    { time: "9:00", count: 8 },
    { time: "10:00", count: 12 },
    { time: "11:00", count: 10 },
    { time: "14:00", count: 15 },
    { time: "15:00", count: 18 },
    { time: "16:00", count: 14 },
    { time: "17:00", count: 8 },
]

const AppointmentChart = () => {
    const [period, setPeriod] = useState<number>(0)
    const { data: statsResponse, isLoading } = useGetAppointmentStatsQuery(period)
    const stats = statsResponse?.data

    useEffect(() => {
        // hook will auto-refetch
    }, [period])

    if (isLoading || !stats) {
        return <Card title="Thống kê lịch hẹn" className="shadow-sm">Loading...</Card>
    }

    return (
        <Card
            title="Thống kê lịch hẹn"
            variant="borderless"
            className="shadow-sm"
            extra={
                <Select value={period} style={{ width: 120 }} onChange={value => setPeriod(value)}>
                    <Option value="0">Tuần này</Option>
                    <Option value="1">Tháng này</Option>
                    <Option value="2">Năm này</Option>
                </Select>
            }
        >
            <Row gutter={[24, 24]}>
                {/* Weekly Trend */}
                <Col xs={24} lg={14}>
                    <div className="mb-4">
                        <h4 className="text-gray-700 font-medium mb-3">
                            {period === 0
                                ? "Xu hướng theo tuần"
                                : period === 1
                                    ? "Xu hướng theo tháng"
                                    : "Xu hướng theo năm"}
                        </h4>
                        <ResponsiveContainer width="100%" height={280}>
                            <LineChart data={stats.trends}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="label" stroke="#64748b" />
                                <YAxis stroke="#64748b" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "white",
                                        border: "1px solid #e2e8f0",
                                        borderRadius: "8px",
                                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#0d9488"
                                    strokeWidth={3}
                                    dot={{ fill: "#0d9488", strokeWidth: 2, r: 4 }}
                                    name="Số lịch hẹn"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Col>

                {/* Hourly Distribution */}
                <Col xs={24} lg={10}>
                    <div className="mb-4">
                        <h4 className="text-gray-700 font-medium mb-3">Phân bố theo giờ (hôm nay)</h4>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={stats.distributions}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="hour" stroke="#64748b" />
                                <YAxis stroke="#64748b" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "white",
                                        border: "1px solid #e2e8f0",
                                        borderRadius: "8px",
                                    }}
                                />
                                <Bar dataKey="count" fill="#0d9488" radius={[4, 4, 0, 0]} name="Số lịch hẹn" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Col>
            </Row>

            {/* Summary Stats */}
            <Row gutter={[16, 16]} className="mt-6 pt-6 border-t border-gray-100">
                <Col xs={12} sm={6}>
                    <Statistic
                        title={
                            period === 0
                                ? "Tuần này"
                                : period === 1
                                    ? "Tháng này"
                                    : "Năm này"
                        }
                        value={stats.totalInPeriod}
                        suffix="lịch hẹn"
                        valueStyle={{ color: "#0d9488", fontSize: 20 }}
                    />
                </Col>
                <Col xs={12} sm={6}>
                    <Statistic
                        title="Tỷ lệ hoàn thành"
                        value={stats.completionRate}
                        suffix="%"
                        valueStyle={{ color: "#10b981", fontSize: 20 }}
                    />
                </Col>
                <Col xs={12} sm={6}>
                    <Statistic
                        title="Trung bình/ngày"
                        value={stats.averagePerDay}
                        suffix="lịch hẹn"
                        valueStyle={{ color: "#3b82f6", fontSize: 20 }}
                    />
                </Col>
                <Col xs={12} sm={6}>
                    <Statistic
                        title="Tỷ lệ hủy"
                        value={stats.cancelRate}
                        suffix="%"
                        valueStyle={{ color: "#ef4444", fontSize: 20 }}
                    />
                </Col>
            </Row>
        </Card>
    )
}

export default AppointmentChart