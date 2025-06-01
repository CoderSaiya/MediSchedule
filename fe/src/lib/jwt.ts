import {jwtDecode} from "jwt-decode";

interface JWTPayload {
    userId: string;
    role: string;
}

export function decodeToken(token: string): { userId: string; role: string } {
    try {
        const decoded = jwtDecode<JWTPayload>(token);
        const userId = decoded.userId;
        const role = decoded.role;
        return { userId, role };
    } catch (err) {
        console.error("Giải mã token thất bại:", err);
        return { userId: "", role: "" };
    }
}