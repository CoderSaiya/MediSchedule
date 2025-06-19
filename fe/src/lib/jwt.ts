import {jwtDecode} from "jwt-decode";

interface JWTPayload {
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
}

export function decodeToken(token: string): { userId: string; role: string } {
    try {
        const decoded = jwtDecode<JWTPayload>(token);
        const userId =
            decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
            "";
        const role =
            decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
            "";
        return { userId, role };
    } catch (err) {
        console.error("Giải mã token thất bại:", err);
        return { userId: "", role: "" };
    }
}