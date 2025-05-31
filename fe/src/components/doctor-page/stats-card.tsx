"use client"

import { Card, CardContent } from "@/components/ui/card"
import { type LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
    title: string
    value: string
    change: string
    trend: "up" | "down" | "neutral"
    icon: LucideIcon
    color: string
    bgColor: string
}

export function StatsCard({ title, value, change, trend, icon: Icon, color, bgColor }: StatsCardProps) {
    const getTrendIcon = () => {
        switch (trend) {
            case "up":
                return <TrendingUp className="h-3 w-3 text-green-600" />
            case "down":
                return <TrendingDown className="h-3 w-3 text-red-600" />
            case "neutral":
                return <Minus className="h-3 w-3 text-gray-600" />
            default:
                return null
        }
    }

    const getTrendColor = () => {
        switch (trend) {
            case "up":
                return "text-green-600"
            case "down":
                return "text-red-600"
            case "neutral":
                return "text-gray-600"
            default:
                return "text-gray-600"
        }
    }

    return (
        <Card className="hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">{title}</p>
                        <p className="text-3xl font-bold text-gray-900">{value}</p>
                        <div className={cn("flex items-center space-x-1 text-xs", getTrendColor())}>
                            {getTrendIcon()}
                            <span>{change}</span>
                        </div>
                    </div>
                    <div className={cn("p-3 rounded-lg", bgColor)}>
                        <Icon className={cn("h-6 w-6", color)} />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}