"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Phone, Calendar, Heart } from "lucide-react"
import Link from "next/link"
import {DialogTitle} from "@/components/ui/dialog";

export function Header() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 w-full border-b border-teal-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
            <div className="container mx-auto flex h-20 items-center justify-between px-4 max-w-7xl">
                <Link href="/" className="flex items-center space-x-3">
                    <div className="relative">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 shadow-lg">
                            <Heart className="h-6 w-6 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 flex items-center justify-center">
                            <div className="h-2 w-2 rounded-full bg-white"></div>
                        </div>
                    </div>
                    <div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-teal-700 to-teal-600 bg-clip-text text-transparent">
                          MediSchedule
                        </span>
                        <p className="text-xs text-teal-600 font-medium">Healthcare Platform</p>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                    <Link
                        href="/"
                        className="text-sm font-medium text-slate-700 hover:text-teal-600 transition-colors relative group"
                    >
                        Trang chủ
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-500 transition-all group-hover:w-full"></span>
                    </Link>
                    <Link
                        href="/doctors"
                        className="text-sm font-medium text-slate-700 hover:text-teal-600 transition-colors relative group"
                    >
                        Bác sĩ
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-500 transition-all group-hover:w-full"></span>
                    </Link>
                    <button
                        onClick={() => {
                            setIsOpen(false)
                            if (window.location.pathname === "/") {
                                setTimeout(() => {
                                    const serviceSection = document.querySelector('[data-section="services"]')
                                    if (serviceSection) {
                                        serviceSection.scrollIntoView({ behavior: "smooth" })
                                    }
                                }, 100)
                            } else {
                                window.location.href = "/#service"
                            }
                        }}
                        className="text-sm font-medium text-slate-700 hover:text-teal-600 transition-colors relative group"
                    >
                        Dịch vụ
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-500 transition-all group-hover:w-full"></span>
                    </button>
                    <Link
                        href="/about"
                        className="text-sm font-medium text-slate-700 hover:text-teal-600 transition-colors relative group"
                    >
                        Về chúng tôi
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-500 transition-all group-hover:w-full"></span>
                    </Link>
                    <button
                        onClick={() => {
                            setIsOpen(false)
                            if (window.location.pathname === "/") {
                                setTimeout(() => {
                                    const contactSection = document.querySelector('[data-section="contact"]')
                                    if (contactSection) {
                                        contactSection.scrollIntoView({ behavior: "smooth" })
                                    }
                                }, 100)
                            } else {
                                window.location.href = "/#contact"
                            }
                        }}
                        className="text-sm font-medium text-slate-700 hover:text-teal-600 transition-colors relative group"
                    >
                        Liên hệ
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-500 transition-all group-hover:w-full"></span>
                    </button>
                </nav>

                <div className="hidden md:flex items-center space-x-6">
                    <div className="flex items-center space-x-3 px-4 py-2 bg-teal-50 rounded-lg border border-teal-100">
                        <div className="flex items-center justify-center w-8 h-8 bg-teal-500 rounded-lg">
                            <Phone className="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-teal-600 font-medium">Hotline 24/7</p>
                            <p className="text-sm font-bold text-teal-700">1900 1234</p>
                        </div>
                    </div>
                    <Link href="/booking">
                        <Button className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-6 py-2 h-11 shadow-lg hover:shadow-xl transition-all duration-300">
                            <Calendar className="mr-2 h-4 w-4" />
                            Đặt lịch ngay
                        </Button>
                    </Link>
                </div>

                {/* Mobile Navigation */}
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild className="md:hidden">
                        <Button variant="ghost" size="icon" className="h-10 w-10">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-80 bg-gradient-to-b from-white to-teal-50">
                        <DialogTitle className="sr-only">Menu điều hướng</DialogTitle>
                        <div className="flex flex-col space-y-6 mt-6">
                            <Link
                                href="/"
                                onClick={() => setIsOpen(false)}
                                className="text-lg font-medium text-slate-800 hover:text-teal-600 transition-colors"
                            >
                                Trang chủ
                            </Link>
                            <Link
                                href="/doctors"
                                onClick={() => setIsOpen(false)}
                                className="text-lg font-medium text-slate-800 hover:text-teal-600 transition-colors"
                            >
                                Bác sĩ
                            </Link>
                            <button
                                onClick={() => {
                                    setIsOpen(false)
                                    if (window.location.pathname === "/") {
                                        setTimeout(() => {
                                            const contactSection = document.querySelector('[data-section="contact"]')
                                            if (contactSection) {
                                                contactSection.scrollIntoView({ behavior: "smooth" })
                                            }
                                        }, 100)
                                    } else {
                                        window.location.href = "/#contact"
                                    }
                                }}
                                className="text-lg text-left font-medium text-slate-800 hover:text-teal-600 transition-colors"
                            >
                                Dịch vụ
                            </button>
                            <Link
                                href="/about"
                                onClick={() => setIsOpen(false)}
                                className="text-lg font-medium text-slate-800 hover:text-teal-600 transition-colors"
                            >
                                Về chúng tôi
                            </Link>
                            <button
                                onClick={() => {
                                    setIsOpen(false)
                                    if (window.location.pathname === "/") {
                                        setTimeout(() => {
                                            const contactSection = document.querySelector('[data-section="contact"]')
                                            if (contactSection) {
                                                contactSection.scrollIntoView({ behavior: "smooth" })
                                            }
                                        }, 100)
                                    } else {
                                        window.location.href = "/#contact"
                                    }
                                }}
                                className="text-lg text-left font-medium text-slate-800 hover:text-teal-600 transition-colors"
                            >
                                Liên hệ
                            </button>
                            <div className="pt-4 border-t border-teal-200">
                                <div className="bg-teal-50 p-4 rounded-lg mb-4 border border-teal-100">
                                    <div className="flex items-center space-x-3">
                                        <Phone className="h-5 w-5 text-teal-600" />
                                        <div>
                                            <p className="text-sm font-medium text-teal-700">Hotline: 1900 1234</p>
                                            <p className="text-xs text-teal-600">Hỗ trợ 24/7</p>
                                        </div>
                                    </div>
                                </div>
                                <Link href="/booking" onClick={() => setIsOpen(false)}>
                                    <Button className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white shadow-lg">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        Đặt lịch ngay
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    )
}