"use client"

import {type ReactNode, Suspense, useEffect, useState} from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { Provider as ReduxProvider } from "react-redux"
import { persistor, store } from "@/store"
import { PersistGate } from "redux-persist/integration/react";
import {Loader2} from "lucide-react";

function LoadingFallback() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50">
            <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-teal-600" />
                <p className="text-gray-600">Đang tải...</p>
            </div>
        </div>
    )
}

export function Providers({ children }: { children: ReactNode }) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        // Optimize mounting
        const timer = setTimeout(() => setMounted(true), 0)

        // Clean up browser extension attributes
        const cleanupExtensionAttributes = () => {
            const elements = document.querySelectorAll("[bis_skin_checked]")
            elements.forEach((el) => el.removeAttribute("bis_skin_checked"))
        }

        cleanupExtensionAttributes()

        // Use passive observer for better performance
        const observer = new MutationObserver(() => {
            requestIdleCallback(cleanupExtensionAttributes)
        })

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["bis_skin_checked"],
        })

        return () => {
            clearTimeout(timer)
            observer.disconnect()
        }
    }, [])

    return (
        <ReduxProvider store={store}>
            <Suspense fallback={<LoadingFallback />}>
                <PersistGate loading={null} persistor={persistor}>
                    {mounted ? (
                        <NextThemesProvider
                            attribute="class"
                            defaultTheme="light"
                            enableSystem={false}
                            disableTransitionOnChange
                            storageKey="medischedule-theme"
                        >
                            {children}
                        </NextThemesProvider>
                    ) : (
                        <div suppressHydrationWarning className="light bg-gradient-to-br from-teal-50 to-emerald-50 min-h-screen">
                            <LoadingFallback />
                        </div>
                    )}
                </PersistGate>
            </Suspense>
        </ReduxProvider>
    )
}