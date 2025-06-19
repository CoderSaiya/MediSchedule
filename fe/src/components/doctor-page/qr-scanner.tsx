"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Camera, X, CheckCircle, AlertCircle, Loader2, QrCode, RefreshCw } from "lucide-react"
import { QRCodeGenerator } from "@/lib/qr-generator"
import { useUpdateAppointmentStatusMutation } from "@/api"
import { toast } from "sonner"
import jsQR from "jsqr"

// CSS animation cho đường quét
const scanLineStyles = `
  @keyframes scanLine {
    0% {
      transform: translateY(-100%);
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      transform: translateY(400%);
      opacity: 0;
    }
  }
  
  .scan-line {
    animation: scanLine 2s ease-in-out infinite;
  }
`

interface QRScannerProps {
    onScanSuccess?: (appointmentId: string) => void
}

export function QRScanner({ onScanSuccess }: QRScannerProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isScanning, setIsScanning] = useState(false)
    const [cameraReady, setCameraReady] = useState(false)
    const [scannedData, setScannedData] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)
    const [stream, setStream] = useState<MediaStream | null>(null)

    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<number>()
    const scanningRef = useRef<boolean>(false) // Thêm ref để track trạng thái scanning

    const [updateStatus, { isLoading: isUpdating }] = useUpdateAppointmentStatusMutation()

    const startCamera = async () => {
        try {
            setError(null)
            setCameraReady(false)
            setIsScanning(false)
            scanningRef.current = false

            console.log("Requesting camera access...")

            // Stop existing stream
            if (stream) {
                stream.getTracks().forEach((track) => track.stop())
                setStream(null)
            }

            const constraints: MediaStreamConstraints = {
                video: {
                    width: { ideal: 640, min: 320 },
                    height: { ideal: 480, min: 240 },
                    facingMode: "environment",
                },
                audio: false,
            }

            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
            console.log("Camera stream obtained successfully")

            setStream(mediaStream)

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream

                // Wait for video to be ready
                const onVideoReady = () => {
                    console.log("Video is ready to play")
                    setCameraReady(true)
                    setIsScanning(true)
                    scanningRef.current = true
                    // Bắt đầu quét ngay lập tức
                    startContinuousScanning()
                }

                videoRef.current.onloadeddata = onVideoReady
                videoRef.current.oncanplay = onVideoReady

                try {
                    await videoRef.current.play()
                    console.log("Video playing successfully")
                } catch (playError) {
                    console.error("Video play error:", playError)
                    setError("Không thể phát video từ camera")
                }
            }
        } catch (err: any) {
            console.error("Camera access error:", err)
            let errorMessage = "Không thể truy cập camera."

            if (err.name === "NotAllowedError") {
                errorMessage = "Quyền truy cập camera bị từ chối. Vui lòng cấp quyền và thử lại."
            } else if (err.name === "NotFoundError") {
                errorMessage = "Không tìm thấy camera trên thiết bị."
            } else if (err.name === "NotReadableError") {
                errorMessage = "Camera đang được sử dụng bởi ứng dụng khác."
            }

            setError(errorMessage)
        }
    }

    const stopCamera = () => {
        console.log("Stopping camera...")

        // Dừng animation frame trước
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current)
            animationRef.current = undefined
        }

        // Dừng tất cả camera tracks
        if (stream) {
            stream.getTracks().forEach((track) => {
                console.log("Stopping track:", track.kind, track.readyState)
                track.stop()
            })
            setStream(null)
        }

        // Reset video source
        if (videoRef.current) {
            videoRef.current.srcObject = null
        }

        // Reset states
        setIsScanning(false)
        setCameraReady(false)
        scanningRef.current = false
    }

    // Hàm bắt đầu quét liên tục
    const startContinuousScanning = () => {
        if (!scanningRef.current) return

        scanQRCode()
    }

    const scanQRCode = () => {
        // Kiểm tra điều kiện dừng
        if (!videoRef.current || !canvasRef.current || !scanningRef.current) {
            return
        }

        const video = videoRef.current
        const canvas = canvasRef.current
        const context = canvas.getContext("2d")

        // Check if video is ready and has data
        if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) {
            // Tiếp tục quét nếu video chưa sẵn sàng
            if (scanningRef.current) {
                animationRef.current = requestAnimationFrame(scanQRCode)
            }
            return
        }

        // Set canvas size to match video dimensions
        canvas.width = video.videoWidth || 640
        canvas.height = video.videoHeight || 480

        // Draw current video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Get image data and scan for QR code
        try {
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            })

            if (code && code.data) {
                console.log("QR Code detected:", code.data)
                handleQRCodeDetected(code.data)
                return // Dừng quét khi đã tìm thấy QR code
            }
        } catch (error) {
            console.error("Error scanning QR code:", error)
        }

        // Tiếp tục quét nếu chưa tìm thấy QR code
        if (scanningRef.current) {
            animationRef.current = requestAnimationFrame(scanQRCode)
        }
    }

    const handleQRCodeDetected = async (qrData: string) => {
        try {
            // Dừng quét khi đã phát hiện QR code
            setIsScanning(false)
            scanningRef.current = false
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
        scanningRef.current = false // Reset scanning state
        startCamera()
    }

    const closeDialog = () => {
        console.log("Closing dialog and cleaning up...")

        // Dừng tất cả hoạt động trước
        scanningRef.current = false
        setIsScanning(false)

        // Dừng camera và cleanup
        stopCamera()

        // Reset states
        setScannedData(null)
        setError(null)
        setCameraReady(false)

        // Đóng dialog
        setIsOpen(false)
    }

    // Auto start camera when dialog opens
    useEffect(() => {
        if (isOpen && !scannedData && !error) {
            startCamera()
        }
    }, [isOpen, scannedData, error])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopCamera()
        }
    }, [])

    return (
        <>
            {/* Inject CSS styles */}
            <style dangerouslySetInnerHTML={{ __html: scanLineStyles }} />

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
                        {(cameraReady || (!error && !scannedData)) && (
                            <div className="relative">
                                <video
                                    ref={videoRef}
                                    className="w-full h-64 object-cover rounded-lg bg-gray-900"
                                    playsInline
                                    muted
                                    autoPlay
                                    style={{ objectFit: 'cover' }}
                                />
                                <canvas ref={canvasRef} className="hidden" />

                                {/* Scanning overlay */}
                                {cameraReady && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-48 h-48 border-2 border-teal-500 rounded-lg relative">
                                            {/* Corner indicators */}
                                            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-teal-500"></div>
                                            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-teal-500"></div>
                                            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-teal-500"></div>
                                            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-teal-500"></div>

                                            {/* Scanning animation - đường quét từ trên xuống */}
                                            {isScanning && (
                                                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                                    <div className="scan-line w-full h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-lg shadow-teal-400/50"></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Manual scan button - Removed vì giờ đã tự động quét liên tục */}

                                {/* Status indicator */}
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                                    <Badge className="bg-teal-600 text-white">
                                        {!cameraReady ? (
                                            <>
                                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                                Đang khởi tạo camera...
                                            </>
                                        ) : isScanning ? (
                                            <>
                                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                                Đang quét...
                                            </>
                                        ) : (
                                            <>
                                                <Camera className="h-3 w-3 mr-1" />
                                                Sẵn sàng
                                            </>
                                        )}
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