"use client"

import type React from "react"

import { useContext, useEffect, useState } from "react"
import { AdminContext } from "@/components/admin/context"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { LayoutDashboard, BriefcaseMedical, User, Pill, Hospital, Bell, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {DialogTitle} from "@/components/ui/dialog";

interface MenuItem {
    key: string
    label: string
    href: string
    icon: React.ReactNode
}

const AdminSideBar = () => {
    const { collapseMenu, setCollapseMenu } = useContext(AdminContext)!
    const [isMobile, setIsMobile] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 1024)
        }

        checkScreenSize()
        window.addEventListener("resize", checkScreenSize)
        return () => window.removeEventListener("resize", checkScreenSize)
    }, [])

    const menuItems: MenuItem[] = [
        {
            key: "dashboard",
            label: "Bảng điều khiển",
            href: "/admin/dashboard",
            icon: <LayoutDashboard size={18} />,
        },
        {
            key: "doctors",
            label: "Bác sĩ",
            href: "/admin/dashboard/doctor",
            icon: <BriefcaseMedical size={18} />,
        },
        {
            key: "medicines",
            label: "Thuốc",
            href: "/admin/dashboard/medical",
            icon: <Pill size={18} />,
        },
        {
            key: "hospitals",
            label: "Bệnh viện",
            href: "/admin/dashboard/hospital",
            icon: <Hospital size={18} />,
        },
        {
            key: "notifications",
            label: "Thông báo",
            href: "/admin/dashboard/notification",
            icon: <Bell size={18} />,
        },
    ]

    const isActiveRoute = (href: string) => {
        if (pathname === href) return true
        return href !== "/admin/dashboard" && pathname.startsWith(href + "/");
    }

    const handleMenuItemClick = () => {
        if (isMobile) {
            setCollapseMenu(true)
        }
    }

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-gradient-to-b from-teal-500 to-teal-700">
            {/* Header */}
            <div className="h-16 flex items-center justify-center border-b border-teal-400/30 px-4">
                {isMobile || !collapseMenu ? (
                    <div className="text-white font-bold text-xl">MediSchedule</div>
                ) : (
                    <div className="text-white font-bold text-lg">MS</div>
                )}
            </div>

            {/* Navigation Menu */}
            <ScrollArea className="flex-1 px-2 py-4">
                <nav className="space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.key}
                            href={item.href}
                            onClick={handleMenuItemClick}
                            className={`flex items-center gap-3 px-3 py-3 rounded-lg text-white transition-all duration-200 hover:bg-teal-600 group ${
                                isActiveRoute(item.href) ? "bg-teal-800 shadow-lg" : "hover:bg-teal-600"
                            } ${collapseMenu && !isMobile ? "justify-center px-2" : ""}`}
                        >
                            <div className="flex-shrink-0">{item.icon}</div>

                            {(!collapseMenu || isMobile) && (
                                <span className="font-medium text-sm lg:text-base truncate">{item.label}</span>
                            )}

                            {/* Active indicator */}
                            {isActiveRoute(item.href) && <div className="ml-auto w-2 h-2 bg-white rounded-full flex-shrink-0" />}
                        </Link>
                    ))}
                </nav>
            </ScrollArea>

            {/* Footer */}
            <div className="p-4 border-t border-teal-400/30">
                <div className="flex items-center gap-3 text-white/80 text-sm">
                    {(!collapseMenu || isMobile) && (
                        <>
                            <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                                <User size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">Admin</p>
                                <p className="text-xs text-white/60 truncate">Quản trị viên</p>
                            </div>
                        </>
                    )}
                    {collapseMenu && !isMobile && (
                        <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center mx-auto">
                            <User size={16} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )

    if (isMobile) {
        return (
            <Sheet open={!collapseMenu} onOpenChange={(open) => setCollapseMenu(!open)}>
                <SheetContent side="left" className="p-0 w-80 border-0">
                    <DialogTitle className="sr-only">Menu điều hướng</DialogTitle>
                    <SidebarContent />
                </SheetContent>
            </Sheet>
        )
    }

    return (
        <div className={`h-screen shadow-lg transition-all duration-300 ease-in-out ${collapseMenu ? "w-16" : "w-64"}`}>
            <SidebarContent />
        </div>
    )
}

export default AdminSideBar
