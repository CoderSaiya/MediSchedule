import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import {Providers} from "@/app/providers";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "MediSchedule - Đặt lịch khám bệnh trực tuyến",
    description: "Hệ thống đặt lịch khám bệnh trực tuyến hiện đại nhất Việt Nam",
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="vi" suppressHydrationWarning>
        <head>
            <script
                dangerouslySetInnerHTML={{
                    __html: `
              // Prevent hydration mismatch from browser extensions
              if (typeof window !== 'undefined') {
                window.__NEXT_HYDRATION_CB = function() {
                  // Remove any browser extension attributes that might cause hydration issues
                  const elements = document.querySelectorAll('[bis_skin_checked]');
                  elements.forEach(el => el.removeAttribute('bis_skin_checked'));
                };
              }
            `,
                }}
            />
        </head>
        <body className={inter.className} suppressHydrationWarning>
        <Providers>{children}</Providers>
        </body>
        </html>
    )
}