"use client";

import { useState } from "react";
import Link from "next/link"
import { Heart, Stethoscope, Phone, Video, BriefcaseMedical } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);

    const [role, setRole] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const canLogin = username.trim() !== "" && password.trim() !== "";


    const fakeLoginApi = (username: string, password: string) =>
        new Promise<{ success: boolean; message: string }>((resolve) => {
            setTimeout(() => {
                if (username === "admin" && password === "123456") {
                    resolve({ success: true, message: "Đăng nhập thành công!" });
                } else {
                    resolve({ success: false, message: "Tên đăng nhập hoặc mật khẩu không đúng." });
                }
            }, 1500);
        });

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!canLogin || loading) return;

        setError(null);
        setSuccessMsg(null);
        setLoading(true);

        try {
            const result = await fakeLoginApi(username, password);

            if (result.success) {
                setSuccessMsg(result.message);
                setError(null);
            } else {
                setError(result.message);
                setSuccessMsg(null);
            }
        } catch {
            setError("Lỗi hệ thống. Vui lòng thử lại.");
            setSuccessMsg(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-[#EDFDF6] to-[#BCF7DB]">
            <div className="min-h-screen flex flex-col lg:flex-row items-center justify-between px-6 lg:px-12 max-w-7xl mx-auto gap-8">

                <div className="relative w-full max-w-lg lg:w-[500px] h-[500px] flex-shrink-0 rounded-lg">

                    <div className="absolute w-[90%] lg:w-96 top-28 left-1/2 -translate-x-1/2 bg-white rounded-full px-6 py-3 shadow-md text-center z-10 whitespace-normal">
                        <p className="text-gray-900 leading-relaxed">
                            Đặt khám <span className="font-semibold text-blue-600 text-siz">DỄ DÀNG HƠN</span> <br />
                            trên ứng dụng <span className="font-bold text-green-600">MediSchedule</span> với hơn <br />
                            <span className="font-semibold text-blue-600">100</span> bác sĩ,
                            <span className="font-semibold text-blue-600"> 50</span> phòng khám,
                            <span className="font-semibold text-blue-600"> 10</span> bệnh viện
                        </p>
                    </div>

                    <img
                        src="/imgs/login1.jpg"
                        alt="Login"
                        className="absolute bottom-20 left-1/2 w-56 h-36 lg:w-72 lg:h-48 -translate-x-1/2 rounded-lg shadow-lg object-cover"
                        draggable={false}
                    />

                    <div className="absolute w-16 h-16 top-4 left-24 bg-yellow-200 rounded-full p-3 shadow-lg cursor-default flex items-center justify-center z-20">
                        <span className="inline-block" style={{ transform: 'rotate(-15deg)' }}>
                            <BriefcaseMedical color="#FFF" size={40} />
                        </span>
                    </div>
                    <div className="absolute w-16 h-16 top-8 right-24 bg-purple-300 rounded-full p-3 shadow-lg cursor-default flex items-center justify-center z-20">
                        <span className="inline-block" style={{ transform: 'rotate(15deg)' }}>
                            <Stethoscope color="#FFF" size={40} />
                        </span>
                    </div>
                    <div className="absolute top-1/2 right-0 -translate-y-1/2 w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg cursor-default z-20">
                        <img style={{ transform: 'rotate(15deg)' }}
                            src="/imgs/login2.jpg"
                            alt="Doctor avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="absolute w-16 h-16 bottom-0 left-16 bg-green-300 rounded-full p-3 shadow-lg cursor-default flex items-center justify-center z-20">
                        <span className="inline-block" style={{ transform: 'rotate(-90deg)' }}>
                            <Phone color="#FFF" size={40} />
                        </span>
                    </div>

                    <div className="absolute w-16 h-16 bottom-0 right-20 bg-blue-300 rounded-full p-3 shadow-lg cursor-default flex items-center justify-center z-20">
                        <span className="inline-block" style={{ transform: 'rotate(15deg)' }}>
                            <Video color="#FFF" size={40} />
                        </span>
                    </div>

                    <div className="absolute w-16 h-16 bottom-44 left-0 bg-pink-200 rounded-full p-3 shadow-lg cursor-default text-pink-500 flex items-center justify-center z-20">
                        <span className="-rotate-45 inline-block">
                            <Heart color="#FFF" size={40} />
                        </span>
                    </div>
                </div>

                <div className="flex-1 max-w-lg bg-white rounded-3xl p-6 lg:p-10 shadow-md w-full" >
                    <h2 className="text-3xl font-bold font-sans bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent mb-6 leading-snug text-center" >
                        ĐĂNG NHẬP
                    </h2>

                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    {successMsg && <p className="text-green-600 text-center mb-4">{successMsg}</p>}

                    <form className="space-y-5" onSubmit={handleLoginSubmit}>
                        <div>
                            <Label htmlFor="username" className="block py-1 text-base font-medium bg-gradient-to-r from-teal-600 to-emerald-600  bg-clip-text text-transparent">
                                Tên đăng nhập
                            </Label>
                            <Input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Tên đăng nhập"
                                required
                                className="w-full py-6 text-lg focus:border-green-300"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <Label htmlFor="password" className="block py-1  text-base font-medium bg-gradient-to-r from-teal-600 to-emerald-600  bg-clip-text text-transparent">
                                Mật khẩu
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Nhập mật khẩu"
                                required
                                className="w-full py-6 text-lg focus:border-green-300"
                                disabled={loading}
                            />
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-600">
                            <Label className="flex items-center space-x-2 cursor-pointer select-none">
                                <Input
                                    type="checkbox"
                                    checked={remember}
                                    onChange={() => setRemember(!remember)}
                                    className="w-4 h-4"
                                    disabled={loading}
                                />
                                <span className="block py-1 text-base font-medium bg-gradient-to-r from-teal-600 to-emerald-600  bg-clip-text text-transparent">Ghi nhớ mật khẩu</span>
                            </Label>
                            <a href="#" className="text-blue-600 hover:underline text-base">
                                Quên mật khẩu?
                            </a>
                        </div>

                        <Link href={role === "admin" ? "/admin" : role === "doctor" ? "/doctor" : "/"}>
                            <Button
                                type="submit"
                                disabled={!canLogin || loading}
                                className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-8 py-4 text-lg h-14 shadow-xl hover:shadow-2xl transition-all duration-300 group"
                            >
                                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                            </Button>
                        </Link>
                    </form>

                </div>
            </div>
        </div>
    );
}
