"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Smartphone, RefreshCw, XCircle, Clock } from "lucide-react"
import Image from "next/image"

interface QRCodeDisplayProps {
    payUrl: string
    orderId: string
    amount: number
    onPaymentSuccess: () => void
    onPaymentFailed: (error: string) => void
}

export function QRCodeDisplay({ payUrl, orderId, amount, onPaymentSuccess, onPaymentFailed }: QRCodeDisplayProps) {
    const [countdown, setCountdown] = useState(300) // 5 minutes
    const [isExpired, setIsExpired] = useState(false)

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    setIsExpired(true)
                    clearInterval(timer)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    const handleOpenMomoApp = () => {
        // Try to open MoMo app, fallback to web
        window.open(payUrl, "_blank")
    }

    if (isExpired) {
        return (
            <Card className="border-red-200 bg-red-50">
                <CardContent className="p-6 text-center">
                    <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Mã QR đã hết hạn</h3>
                    <p className="text-red-600 mb-4">Vui lòng tạo lại giao dịch thanh toán</p>
                    <Button onClick={() => window.location.reload()} variant="outline">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Tạo lại
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border-pink-200 bg-pink-50">
            <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center space-x-2">
                    <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center">
                        <Smartphone className="h-5 w-5 text-white" />
                    </div>
                    <span>Thanh toán MoMo</span>
                </CardTitle>
                <div className="flex items-center justify-center space-x-2">
                    <Badge className="bg-pink-600 text-white">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTime(countdown)}
                    </Badge>
                    <Badge variant="outline" className="border-pink-300 text-pink-700">
                        {amount.toLocaleString()} VNĐ
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* QR Code */}
                <div className="text-center">
                    <div className="bg-white p-6 rounded-xl inline-block shadow-lg border-2 border-pink-200">
                        <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                            {/* Generate QR Code URL - you might want to use a QR code library */}
                            <Image
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(payUrl)}`}
                                alt="MoMo QR Code"
                                width={256}
                                height={256}
                                className="rounded-lg"
                                onError={() => {
                                    // Fallback if QR service fails
                                    console.error("Failed to load QR code")
                                }}
                            />
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-4">Quét mã QR bằng ứng dụng MoMo để thanh toán</p>
                </div>

                {/* Instructions */}
                <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Hướng dẫn thanh toán:</h4>
                    <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 text-sm font-bold">
                                1
                            </div>
                            <p className="text-sm text-gray-700">Mở ứng dụng MoMo trên điện thoại</p>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 text-sm font-bold">
                                2
                            </div>
                            <p className="text-sm text-gray-700">Chọn &#34;Quét mã QR&#34; và quét mã trên màn hình</p>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 text-sm font-bold">
                                3
                            </div>
                            <p className="text-sm text-gray-700">Xác nhận thanh toán trong ứng dụng MoMo</p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <Button onClick={handleOpenMomoApp} className="w-full bg-pink-600 hover:bg-pink-700 text-white">
                        <Smartphone className="h-4 w-4 mr-2" />
                        Mở ứng dụng MoMo
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => window.location.reload()}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Tạo mã QR mới
                    </Button>
                </div>

                {/* Order Info */}
                <div className="bg-white p-4 rounded-lg border border-pink-200">
                    <h5 className="font-medium text-gray-900 mb-2">Thông tin giao dịch</h5>
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Mã đơn hàng:</span>
                            <span className="font-mono text-gray-900">{orderId}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Số tiền:</span>
                            <span className="font-semibold text-pink-600">{amount.toLocaleString()} VNĐ</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}