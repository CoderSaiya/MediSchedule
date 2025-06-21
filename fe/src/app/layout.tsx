import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import {Providers} from "@/app/providers";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    preload: true,
    fallback: ["system-ui", "arial"],
})

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
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

            <meta charSet="UTF-8"/>
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                      // Performance optimization
                      if (typeof window !== 'undefined') {
                        // Prevent hydration mismatch
                        window.__NEXT_HYDRATION_CB = function() {
                          const elements = document.querySelectorAll('[bis_skin_checked]');
                          elements.forEach(el => el.removeAttribute('bis_skin_checked'));
                        };
                        
                        // Preload critical routes
                        if ('requestIdleCallback' in window) {
                          requestIdleCallback(() => {
                            const routes = ['/doctors', '/booking', '/services'];
                            routes.forEach(route => {
                              const link = document.createElement('link');
                              link.rel = 'prefetch';
                              link.href = route;
                              document.head.appendChild(link);
                            });
                          });
                        }
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