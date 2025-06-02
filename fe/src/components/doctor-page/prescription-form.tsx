"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, FileImage } from "lucide-react"
import { toast } from "sonner"
import {CreatePrescriptionRequest, PrescriptionMedication} from "@/types/doctor";
import {useCreatePrescriptionMutation, useGetMedicinesQuery} from "@/api";

interface PrescriptionFormProps {
    appointmentId: string
    patientName: string
    onClose: () => void
    onSuccess: () => void
    refetch: () => void
}

export function PrescriptionForm({ appointmentId, patientName, onClose, onSuccess, refetch }: PrescriptionFormProps) {
    const [notes, setNotes] = useState<string>("")
    const [medications, setMedications] = useState<PrescriptionMedication[]>([
        {
            medicineId: "",
            medicineName: "",
            dosage: "",
            quantity: 1,
            unit: "",
            instructions: "",
            itemNotes: "",
        },
    ])
    const [isGenerating, setIsGenerating] = useState(false)

    const addMedication = () => {
        setMedications([
            ...medications,
            {
                medicineId: "",
                medicineName: "",
                dosage: "",
                quantity: 1,
                unit: "",
                instructions: "",
                itemNotes: "",
            },
        ])
    }

    const {data: medicinesResponse} = useGetMedicinesQuery()
    const [createPrescription] = useCreatePrescriptionMutation();

    const medicines = medicinesResponse?.data || [];

    const removeMedication = (index: number) => {
        if (medications.length > 1) {
            setMedications(medications.filter((_, i) => i !== index))
        }
    }

    const updateMedication = (index: number, field: keyof PrescriptionMedication, value: string | number) => {
        const updated = [...medications]
        updated[index] = { ...updated[index], [field]: value }

        // If medicine is selected, auto-fill name and unit
        if (field === "medicineId") {
            const medicine = medicines.find((m) => m.id === value)
            if (medicine) {
                updated[index].medicineName = medicine.name
            }
        }

        setMedications(updated)
    }

    const generatePrescriptionImage = async (prescriptionData: any): Promise<File> => {
        // Create a canvas to generate prescription image
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")!

        // Set canvas size
        canvas.width = 800
        canvas.height = 1000

        // White background
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Header
        ctx.fillStyle = "#0f766e"
        ctx.fillRect(0, 0, canvas.width, 100)

        // Title
        ctx.fillStyle = "#ffffff"
        ctx.font = "bold 28px Arial"
        ctx.textAlign = "center"
        ctx.fillText("ĐơN THUỐC", canvas.width / 2, 50)

        // Patient info
        ctx.fillStyle = "#000000"
        ctx.font = "18px Arial"
        ctx.textAlign = "left"
        ctx.fillText(`Bệnh nhân: ${patientName}`, 50, 150)
        ctx.fillText(`Ngày kê đơn: ${new Date().toLocaleDateString("vi-VN")}`, 50, 180)

        if (notes) {
            ctx.fillText(`Ghi chú: ${notes}`, 50, 210)
        }

        // Medications header
        ctx.font = "bold 20px Arial"
        ctx.fillText("DANH SÁCH THUỐC:", 50, 260)

        // Medications list
        ctx.font = "16px Arial"
        let yPos = 300

        medications.forEach((med, index) => {
            if (med.medicineName) {
                ctx.fillText(`${index + 1}. ${med.medicineName}`, 70, yPos)
                yPos += 30
                ctx.fillText(`   Liều dùng: ${med.dosage}`, 70, yPos)
                yPos += 25
                ctx.fillText(`   Số lượng: ${med.quantity} ${med.unit}`, 70, yPos)
                yPos += 25
                ctx.fillText(`   Cách dùng: ${med.instructions}`, 70, yPos)
                yPos += 25
                if (med.itemNotes) {
                    ctx.fillText(`   Ghi chú: ${med.itemNotes}`, 70, yPos)
                    yPos += 25
                }
                yPos += 20
            }
        })

        // Footer
        ctx.font = "14px Arial"
        ctx.textAlign = "center"
        ctx.fillText("Bác sĩ kê đơn", canvas.width - 150, canvas.height - 100)
        ctx.fillText("(Ký tên và đóng dấu)", canvas.width - 150, canvas.height - 80)

        // Convert canvas to blob then to file
        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                const file = new File([blob!], `prescription_${appointmentId}_${Date.now()}.png`, {
                    type: "image/png",
                })
                resolve(file)
            }, "image/png")
        })
    }

    const handleSubmit = async () => {
        // Validate form
        const validMedications = medications.filter((med) => med.medicineId && med.dosage && med.instructions)

        if (validMedications.length === 0) {
            toast.error("Vui lòng thêm ít nhất một loại thuốc")
            return
        }

        setIsGenerating(true)

        try {
            // Generate prescription image
            const prescriptionFile = await generatePrescriptionImage({
                patientName,
                notes,
                medications: validMedications,
                date: new Date().toISOString(),
            })

            const request: CreatePrescriptionRequest = {
                appointmentId: appointmentId,
                file: prescriptionFile,
                items: validMedications.map(med => ({
                    medicineId: med.medicineId,
                    medicineName: "",
                    dosage: med.dosage,
                    quantity: med.quantity,
                    unit: med.unit,
                    instructions: med.instructions,
                    itemNotes: med.itemNotes !== "" ? med.itemNotes : null,
                })),
                notes: notes
            }

            await createPrescription(request)

            toast.success("Đơn thuốc đã được tạo thành công")

            refetch();
            onSuccess()
        } catch {
            toast.error("Có lỗi xảy ra khi tạo đơn thuốc")
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileImage className="h-5 w-5" />
                        Kê đơn thuốc cho {patientName}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* General Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="notes">Ghi chú chung</Label>
                        <Textarea
                            id="notes"
                            placeholder="Nhập ghi chú về tình trạng bệnh nhân, lời dặn..."
                            value={notes ?? ""}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                        />
                    </div>

                    {/* Medications */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-lg font-semibold">Danh sách thuốc</Label>
                            <Button onClick={addMedication} size="sm" variant="outline">
                                <Plus className="h-4 w-4 mr-2" />
                                Thêm thuốc
                            </Button>
                        </div>

                        {medications.map((medication, index) => (
                            <Card key={index}>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base flex items-center justify-between">
                                        Thuốc {index + 1}
                                        {medications.length > 1 && (
                                            <Button
                                                onClick={() => removeMedication(index)}
                                                size="sm"
                                                variant="ghost"
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Tên thuốc</Label>
                                            <Select
                                                value={medication.medicineId}
                                                onValueChange={(value) => updateMedication(index, "medicineId", value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn thuốc" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {medicines.map((medicine) => (
                                                        <SelectItem key={medicine.id} value={medicine.id}>
                                                            {medicine.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Liều dùng</Label>
                                            <Input
                                                placeholder="VD: 1 viên/lần, 2 lần/ngày"
                                                value={medication.dosage}
                                                onChange={(e) => updateMedication(index, "dosage", e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label>Số lượng</Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={medication.quantity}
                                                onChange={(e) => updateMedication(index, "quantity", Number.parseInt(e.target.value) || 1)}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Đơn vị</Label>
                                            <Input
                                                value={medication.unit}
                                                onChange={(e) => updateMedication(index, "unit", e.target.value)}
                                                placeholder="viên, chai, gói..."
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Cách dùng</Label>
                                            <Input
                                                placeholder="Uống sau ăn, trước ăn..."
                                                value={medication.instructions}
                                                onChange={(e) => updateMedication(index, "instructions", e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Ghi chú riêng</Label>
                                        <Input
                                            placeholder="Ghi chú đặc biệt cho thuốc này..."
                                            value={medication.itemNotes ?? ""}
                                            onChange={(e) => updateMedication(index, "itemNotes", e.target.value)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <Button variant="outline" onClick={onClose}>
                            Hủy
                        </Button>
                        <Button onClick={handleSubmit} disabled={isGenerating} className="bg-teal-600 hover:bg-teal-700">
                            {isGenerating ? "Đang tạo đơn thuốc..." : "Tạo đơn thuốc"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}