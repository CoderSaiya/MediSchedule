"use client"

import { useEffect, useState } from "react"
import { useCheckPaymentStatusQuery } from "@/api"

interface PaymentStatusMonitorProps {
    orderId: string
    onPaymentSuccess: () => void
    onPaymentFailed: (error: string) => void
    enabled: boolean
}

export function PaymentStatusMonitor({
                                         orderId,
                                         onPaymentSuccess,
                                         onPaymentFailed,
                                         enabled,
                                     }: PaymentStatusMonitorProps) {
    const [pollingInterval, setPollingInterval] = useState(2000) // Start with 2 seconds
    const [retryCount, setRetryCount] = useState(0)
    const [lastStatus, setLastStatus] = useState<string | null>(null)
    const [paymentSuccessTriggered, setPaymentSuccessTriggered] = useState(false)

    const {
        data: statusResponse,
        error,
        refetch,
    } = useCheckPaymentStatusQuery(orderId, {
        skip: !enabled || !orderId || paymentSuccessTriggered,
        pollingInterval: enabled && !paymentSuccessTriggered ? pollingInterval : 0,
    })

    useEffect(() => {
        if (statusResponse && !paymentSuccessTriggered) {
            console.log("Payment status response:", statusResponse)

            setRetryCount(0)
            setPollingInterval(2000)

            if (statusResponse.status === "success") {
                // Payment successful - stop polling and trigger callback only once
                console.log("✅ Payment successful! Triggering success callback...")
                setPollingInterval(0)
                setPaymentSuccessTriggered(true)
                onPaymentSuccess()
            } else if (statusResponse.status === "processing" || statusResponse.status === "pending") {
                // Continue polling but with exponential backoff after some time
                if (retryCount > 10) {
                    setPollingInterval(Math.min(pollingInterval * 1.2, 10000)) // Max 10 seconds
                }
                setLastStatus(statusResponse.status)
                console.log(`Payment status: ${statusResponse.status}`)
            } else if (statusResponse.status === "failed") {
                // Payment failed
                console.log("❌ Payment failed:", statusResponse.message)
                setPollingInterval(0)
                onPaymentFailed(statusResponse.message || "Thanh toán thất bại")
            }
        }
    }, [statusResponse, onPaymentSuccess, onPaymentFailed, retryCount, pollingInterval, paymentSuccessTriggered])

    useEffect(() => {
        if (error) {
            console.error("Error checking payment status:", error)
            setRetryCount((prev) => prev + 1)

            // Exponential backoff on errors
            if (retryCount > 3) {
                setPollingInterval(Math.min(pollingInterval * 1.5, 15000)) // Max 15 seconds on errors
            }

            // Stop polling after too many failures
            if (retryCount > 20) {
                setPollingInterval(0)
                onPaymentFailed("Không thể kiểm tra trạng thái thanh toán. Vui lòng liên hệ hỗ trợ.")
            }
        }
    }, [error, retryCount, pollingInterval, onPaymentFailed])

    // Add visibility change listener to resume polling when tab becomes active
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible" && enabled && pollingInterval === 0 && !paymentSuccessTriggered) {
                // Resume polling if payment was still processing
                if (lastStatus === "processing" || lastStatus === "pending") {
                    console.log("Tab became visible, resuming payment status polling...")
                    setPollingInterval(2000)
                    refetch()
                }
            }
        }

        document.addEventListener("visibilitychange", handleVisibilityChange)
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
    }, [enabled, pollingInterval, lastStatus, refetch, paymentSuccessTriggered])

    // Debug logging
    useEffect(() => {
        if (enabled && !paymentSuccessTriggered) {
            console.log(
                `PaymentStatusMonitor: Polling ${orderId} every ${pollingInterval}ms, Success triggered: ${paymentSuccessTriggered}`,
            )
        }
    }, [enabled, orderId, pollingInterval, paymentSuccessTriggered])

    return null
}