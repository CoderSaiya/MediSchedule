"use client"

import dynamic from "next/dynamic";
import {useEffect} from "react";

const PageContent = dynamic(() => import("@/components/home/page-content"), {
    ssr: false,
    loading: () => <div className="min-h-screen flex items-center justify-center">Loading...</div>
})

export default function MainPage() {
    useEffect(() => {
        const hash = window.location.hash
        if (hash) {
            const sectionName = hash.replace("#", "")
            const section = document.querySelector(`[data-section="${sectionName}"]`)
            if (section) {
                setTimeout(() => {
                    section.scrollIntoView({ behavior: "smooth" })
                }, 100)
            }
        }
    }, [])

    return <PageContent/>;
}
