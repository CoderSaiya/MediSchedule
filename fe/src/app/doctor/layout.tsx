"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/doctor-page/header"
import Sidebar from "@/components/doctor-page/sidebar"
import { motion } from "framer-motion"

interface DoctorLayoutProps {
    children: React.ReactNode
}

export default function DoctorLayout({ children }: DoctorLayoutProps) {
    const [mounted, setMounted] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [doctorInfo, setDoctorInfo] = useState<any>(null)
    const router = useRouter()

    // useEffect(() => {
    //     setMounted(true)
    //
    //     // Check authentication
    //     const token = localStorage.getItem("authToken")
    //     if (!token) {
    //         router.push("/login")
    //         return
    //     }
    //
    //     try {
    //         const userData = JSON.parse(atob(token))
    //         if (userData.role !== "doctor") {
    //             router.push("/login")
    //             return
    //         }
    //
    //         setDoctorInfo(userData)
    //         setIsLoading(false)
    //     } catch (error) {
    //         console.error("Invalid token:", error)
    //         router.push("/login")
    //     }
    // }, [router])

    // if (!mounted || isLoading) {
    //     return (
    //         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    //             <div className="text-center">
    //                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
    //                 <p className="text-gray-600">Đang tải...</p>
    //             </div>
    //         </div>
    //     )
    // }
    //
    // if (!doctorInfo) {
    //     return null
    // }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header doctorInfo={doctorInfo} />

            <div className="flex">
                <Sidebar />

                <main className="flex-1 ml-64">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="p-6"
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    )
}