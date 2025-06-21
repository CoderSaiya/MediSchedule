import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
    // const { nextUrl, cookies } = req
    // const url = nextUrl.clone()
    // if (nextUrl.pathname.startsWith("/doctor")) {
    //     const token = cookies.get("accessToken")?.value
    //     if (!token) {
    //         url.pathname = "/login"
    //         return NextResponse.redirect(url)
    //     }
    // }
}

export const config = {
    matcher: ["/doctor/:path*"]
}