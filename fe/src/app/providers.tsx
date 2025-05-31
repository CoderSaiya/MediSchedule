"use client"

import { type ReactNode, useEffect, useState } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { Provider as ReduxProvider } from "react-redux"
import { store } from "@/store"

export function Providers({ children }: { children: ReactNode }) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)

        const cleanupExtensionAttributes = () => {
            const elements = document.querySelectorAll("[bis_skin_checked]")
            elements.forEach((el) => el.removeAttribute("bis_skin_checked"))
        }

        cleanupExtensionAttributes()

        const observer = new MutationObserver(() => {
            cleanupExtensionAttributes()
        })

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["bis_skin_checked"],
        })

        return () => observer.disconnect()
    }, [])

    // Always wrap with Redux Provider first, even before mounting
    return (
        <ReduxProvider store={store}>
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
                <div suppressHydrationWarning className="light">
                    {children}
                </div>
            )}
        </ReduxProvider>
    )
}