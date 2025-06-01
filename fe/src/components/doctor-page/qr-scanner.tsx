"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Camera, X, CheckCircle, AlertCircle, Loader2, QrCode } from "lucide-react"
import { QRCodeGenerator } from "@/lib/qr-generator"
import { useUpdateAppointmentStatusMutation } from "@/api"
import { toast } from "sonner"
import jsQR from "jsqr"
import {ScannedQRData} from "@/types/qr-code";

interface QRScannerProps {
    doctorId: string
    onScanSuccess?: (appointmentId: string) => void
}

export function QRScanner({ doctorId, onScanSuccess }: QRScannerProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isScanning, setIsScanning] = useState(false)
    const [scannedData, setScannedData] = useState<ScannedQRData | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [stream, setStream] = useState<MediaStream | null>(null)

    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<number | undefined>(undefined)

    const [updateStatus, { isLoading: isUpdating }] = useUpdateAppointmentStatusMutation()

    const startCamera = async () => {
        try {
            setError(null)
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" }, // Use back camera if available
            })
            setStream(mediaStream)
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream
                videoRef.current.play()
            }
            setIsScanning(true)
            scanQRCode()
        } catch (err) {
            setError("Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.")
            console.error("Camera error:", err)
        }
    }

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop())
            setStream(null)
        }
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current)
        }
        setIsScanning(false)
    }

    const scanQRCode = () => {
        if (!videoRef.current || !canvasRef.current || !isScanning) return

        const video = videoRef.current
        const canvas = canvasRef.current
        const context = canvas.getContext("2d")

        if (!context) return

        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
        const code = jsQR(imageData.data, imageData.width, imageData.height)

        if (code) {
            handleQRCodeDetected(code.data)
        } else {
            animationRef.current = requestAnimationFrame(scanQRCode)
        }
    }

    const handleQRCodeDetected = async (qrData: string) => {
        try {
            setIsScanning(false)
            stopCamera()

            // Verify QR code
            const verifiedData = QRCodeGenerator.verifyQRData(qrData)

            if (!verifiedData) {
                setError("Mã QR không hợp lệ hoặc đã hết hạn")
                return
            }

            setScannedData(verifiedData)
        } catch (err) {
            setError("Lỗi khi xử lý mã QR")
            console.error("QR processing error:", err)
        }
    }

    const handleStartExamination = async () => {
        if (!scannedData) return

        try {
            await updateStatus({
                appointmentId: scannedData.appointmentId,
                status: 'confirmed',
            }).unwrap()

            toast.success("Đã bắt đầu khám bệnh")
            setIsOpen(false)
            setScannedData(null)
            onScanSuccess?.(scannedData.appointmentId)
        } catch {
            toast.error("Không thể cập nhật trạng thái lịch hẹn")
        }
    }

    const resetScanner = () => {
        setScannedData(null)
        setError(null)
        startCamera()
    }

    const closeDialog = () => {
        setIsOpen(false)
        stopCamera()
        setScannedData(null)
        setError(null)
    }

    useEffect(() => {
        if (isOpen && !isScanning && !scannedData && !error) {
            startCamera()
        }
    }, [isOpen])

    useEffect(() => {
        return () => {
            stopCamera()
        }
    }, [])

    return (
        <>
            <Button onClick={() => setIsOpen(true)} className="bg-teal-600 hover:bg-teal-700">
                <QrCode className="h-4 w-4 mr-2" />
                Quét mã QR
            </Button>

            <Dialog open={isOpen} onOpenChange={closeDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                            <Camera className="h-5 w-5" />
                            <span>Quét mã QR lịch khám</span>
                        </DialogTitle>
                        <DialogDescription>Hướng camera vào mã QR trên phiếu khám của bệnh nhân</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Camera View */}
                        {isScanning && (
                            <div className="relative">
                                <video ref={videoRef} className="w-full h-64 object-cover rounded-lg bg-gray-100" playsInline muted />
                                <canvas ref={canvasRef} className="hidden" />

                                {/* Scanning overlay */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-48 h-48 border-2 border-teal-500 rounded-lg relative">
                                        <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-teal-500"></div>
                                        <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-teal-500"></div>
                                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-teal-500"></div>
                                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-teal-500"></div>
                                    </div>
                                </div>

                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                                    <Badge className="bg-teal-600 text-white">
                                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                        Đang quét...
                                    </Badge>
                                </div>
                            </div>
                        )}

                        {/* Error State */}
                        {error && (
                            <Card className="border-red-200 bg-red-50">
                                <CardContent className="p-4 text-center">
                                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
                                    <p className="text-red-700 font-medium mb-3">{error}</p>
                                    <Button onClick={resetScanner} variant="outline" size="sm">
                                        Thử lại
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {/* Success State */}
                        {scannedData && (
                            <Card className="border-green-200 bg-green-50">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center space-x-2 text-green-800">
                                        <CheckCircle className="h-5 w-5" />
                                        <span>Mã QR hợp lệ</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Bệnh nhân:</span>
                                            <span className="font-medium">{scannedData.patientName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Ngày khám:</span>
                                            <span className="font-medium">
                        {new Date(scannedData.appointmentDate).toLocaleDateString("vi-VN")}
                      </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Giờ khám:</span>
                                            <span className="font-medium">{scannedData.appointmentTime}</span>
                                        </div>
                                    </div>

                                    <div className="flex space-x-2 pt-2">
                                        <Button
                                            onClick={handleStartExamination}
                                            disabled={isUpdating}
                                            className="flex-1 bg-green-600 hover:bg-green-700"
                                        >
                                            {isUpdating ? (
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            ) : (
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                            )}
                                            Bắt đầu khám
                                        </Button>
                                        <Button onClick={resetScanner} variant="outline">
                                            Quét lại
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Initial State */}
                        {!isScanning && !scannedData && !error && (
                            <Card>
                                <CardContent className="p-6 text-center">
                                    <Camera className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-600 mb-4">Nhấn nút bên dưới để bắt đầu quét mã QR</p>
                                    <Button onClick={startCamera} className="bg-teal-600 hover:bg-teal-700">
                                        <Camera className="h-4 w-4 mr-2" />
                                        Bật camera
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <Button onClick={closeDialog} variant="outline">
                            <X className="h-4 w-4 mr-2" />
                            Đóng
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}