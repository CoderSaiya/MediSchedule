"use client"

import { Card, Row, Col } from "antd"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import {useGetSpecialtyStatsQuery} from "@/api";

const COLORS = [
    "#0d9488",
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ef4444",
    "#6366f1"
]

const SpecialtyStats = () => {
    const {data: specialtyStatsResponse, isLoading} = useGetSpecialtyStatsQuery();
    const specialtyStats = specialtyStatsResponse?.data || []

    const statsWithColor = specialtyStats.map((spec, idx) => ({
        ...spec,
        color: COLORS[idx % COLORS.length]
    }))

    if (isLoading) {
        return <Card title="Thống kê theo khoa" className="shadow-sm">Loading...</Card>
    }

    return (
        <Card title="Thống kê theo khoa" variant="borderless" className="shadow-sm">
            <Row gutter={[24, 24]}>
                <Col xs={24} md={10}>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={statsWithColor}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="percent"
                                nameKey="name"
                            >
                                {statsWithColor.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value) => [`${value}%`, "Tỷ lệ"]}
                                contentStyle={{
                                    backgroundColor: "white",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "8px",
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </Col>

                <Col xs={24} md={14}>
                    <div className="space-y-4">
                        {statsWithColor.map((dept, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                    <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: dept.color }} />
                                    <div>
                                        <div className="font-medium text-gray-900">{dept.name}</div>
                                        <div className="text-sm text-gray-500">{dept.patients} bệnh nhân</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-semibold text-lg" style={{ color: dept.color }}>
                                        {dept.percent}%
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Col>
            </Row>
        </Card>
    )
}

export default SpecialtyStats