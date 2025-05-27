"use client"

import dynamic from "next/dynamic";

const PageContent = dynamic(() => import("@/components/home/page-content"), {
    ssr: false,
    loading: () => <div className="min-h-screen flex items-center justify-center">Loading...</div>
})

export default function MainPage() {
    return <PageContent/>;
}
