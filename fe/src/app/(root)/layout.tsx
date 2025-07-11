import {Header} from "@/components/shared/header";
import {Footer} from "@/components/shared/footer";
import {ChatPopup} from "@/components/shared/chat-popup";
import type React from "react";

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (

        <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
            <Header />
            <main>
                {children}
            </main>
            <Footer />
            <ChatPopup />
        </div>
    );
}