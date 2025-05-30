"use client"

import {useEffect, useRef} from "react"
import { Button } from "@/components/ui/button"
import { Download, Upload, Loader2 } from "lucide-react"
import { MedicalReceipt } from "./medical-receipt"
import { useUploadToBlobMutation } from "@/api"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import {BookingData} from "@/types/appointment";

interface ReceiptGeneratorProps {
    bookingData: BookingData
    onUploadComplete?: (url: string) => void
}

export function ReceiptGenerator({ bookingData, onUploadComplete }: ReceiptGeneratorProps) {
    const receiptRef = useRef<HTMLDivElement>(null)
    const hasUploadedRef = useRef(false)
    const [uploadToBlob, { isLoading: isUploading }] = useUploadToBlobMutation()

    const generateAndUploadReceipt = async () => {
        if (!receiptRef.current) return

        try {
            const canvas = await html2canvas(receiptRef.current, {
                scale: 2,
                backgroundColor: "#ffffff",
                useCORS: true,
                allowTaint: true,
            })

            canvas.toBlob(async (blob) => {
                if (blob) {
                    const containerName = 'receipts'

                    try {
                        const response = await uploadToBlob({
                            file: blob,
                            containerName: containerName, appointmentId:
                            bookingData.appointmentId
                        }).unwrap()

                        if (response.data?.url && onUploadComplete) {
                            onUploadComplete(response.data.url)
                        }
                    } catch (error) {
                        console.error("Error uploading receipt:", error)
                    }
                }
            }, "image/png")
        } catch (error) {
            console.error("Error generating receipt:", error)
        }
    }

    useEffect(() => {
        if (receiptRef.current && !hasUploadedRef.current) {
            hasUploadedRef.current = true
            generateAndUploadReceipt()
        }
    }, [])

    const generateAndDownloadReceipt = async () => {
        if (!receiptRef.current) return

        try {
            const canvas = await html2canvas(receiptRef.current, {
                scale: 2,
                backgroundColor: "#ffffff",
                useCORS: true,
                allowTaint: true,
            })

            // Convert to blob
            canvas.toBlob((blob) => {
                if (blob) {
                    // Download
                    const url = URL.createObjectURL(blob)
                    const link = document.createElement("a")
                    link.href = url
                    link.download = `phieu-kham-${bookingData.appointmentCode}.png`
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                    URL.revokeObjectURL(url)
                }
            }, "image/png")
        } catch (error) {
            console.error("Error generating receipt:", error)
        }
    }

    const captureCanvas = async () => {
        if (!receiptRef.current) return null
        try {
            return await html2canvas(receiptRef.current, {
                scale: 2,
                backgroundColor: "#ffffff",
                useCORS: true,
                allowTaint: true,
            })
        } catch (error) {
            console.error("Error capturing receipt:", error)
            return null
        }
    }

    const generateAndDownloadPDF = async () => {
        const canvas = await captureCanvas()
        if (!canvas) return
        const imgData = canvas.toDataURL("image/png")
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [canvas.width, canvas.height] })
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
        pdf.save(`phieu-kham-${bookingData.appointmentCode}.pdf`)
    }

    return (
        <div className="space-y-6">
            <MedicalReceipt ref={receiptRef} bookingData={bookingData} />

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={generateAndDownloadReceipt} variant="outline" className="flex items-center">
                    <Download className="h-4 w-4 mr-2" />
                    Tải xuống phiếu khám
                </Button>

                <Button
                    onClick={generateAndDownloadPDF}
                    disabled={isUploading}
                    className="flex items-center bg-teal-600 hover:bg-teal-700"
                >
                    <Download className="h-4 w-4 mr-2" />
                    Tải xuống PDF
                </Button>

                {/*<Button*/}
                {/*    onClick={generateAndUploadReceipt}*/}
                {/*    disabled={isUploading}*/}
                {/*    className="flex items-center bg-teal-600 hover:bg-teal-700"*/}
                {/*>*/}
                {/*    {isUploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}*/}
                {/*    {isUploading ? "Đang lưu..." : "Lưu vào hệ thống"}*/}
                {/*</Button>*/}
            </div>
        </div>
    )
}