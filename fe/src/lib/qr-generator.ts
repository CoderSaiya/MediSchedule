import QRCode from "qrcode"
import CryptoJS from "crypto-js"
import {AppointmentQRData} from "@/types/qr-code";

export class QRCodeGenerator {
    private static readonly SECRET_KEY = process.env.NEXT_PUBLIC_QR_SECRET || ""

    static async generateAppointmentQR(appointmentData: {
        appointmentId: string
        patientName: string
        appointmentDate: string
        appointmentTime: string
    }): Promise<string> {
        // Tạo verification code
        const verificationCode = this.generateVerificationCode(appointmentData)

        // Tạo QR data
        const qrData: AppointmentQRData = {
            ...appointmentData,
            verificationCode,
            timestamp: Date.now(),
        }

        // Mã hóa data
        const encryptedData = this.encryptData(JSON.stringify(qrData))

        // Tạo QR code
        const qrCodeDataURL = await QRCode.toDataURL(encryptedData, {
            width: 500,
            margin: 2,
            color: {
                dark: "#0F766E", // Teal color
                light: "#FFFFFF",
            },
        })

        return qrCodeDataURL
    }

    static generateVerificationCode(data: {
        appointmentId: string
        patientName: string
        appointmentDate: string
        appointmentTime: string
    }): string {
        const combined = `${data.appointmentId}-${data.patientName}-${data.appointmentDate}-${data.appointmentTime}`
        return CryptoJS.SHA256(combined + this.SECRET_KEY)
            .toString()
            .substring(0, 16)
    }

    static encryptData(data: string): string {
        return CryptoJS.AES.encrypt(data, this.SECRET_KEY).toString()
    }

    static decryptData(encryptedData: string): string {
        const bytes = CryptoJS.AES.decrypt(encryptedData, this.SECRET_KEY)
        return bytes.toString(CryptoJS.enc.Utf8)
    }

    static verifyQRData(encryptedData: string): AppointmentQRData | null {
        try {
            const decryptedData = this.decryptData(encryptedData)
            const qrData: AppointmentQRData = JSON.parse(decryptedData)

            // Kiểm tra timestamp (QR code có hiệu lực trong 24 giờ)
            const now = Date.now()
            const qrAge = now - qrData.timestamp
            const maxAge = 24 * 60 * 60 * 1000 // 24 hours

            if (qrAge > maxAge) {
                return null
            }

            // Verify verification code
            const expectedCode = this.generateVerificationCode({
                appointmentId: qrData.appointmentId,
                patientName: qrData.patientName,
                appointmentDate: qrData.appointmentDate,
                appointmentTime: qrData.appointmentTime,
            })

            if (qrData.verificationCode !== expectedCode) {
                return null
            }

            return qrData
        } catch (error) {
            console.error("Error verifying QR data:", error)
            return null
        }
    }
}