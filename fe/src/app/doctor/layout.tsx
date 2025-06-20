// app/doctor/layout.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/doctor-page/header";
import Sidebar from "@/components/doctor-page/sidebar";
import { motion } from "framer-motion";
import { useGetDoctorProfileQuery } from "@/api";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import type { DoctorProfile } from "@/types/doctor";
import { logout, setCredentials } from "@/store/slices/authSlice";

function CenterSpinner({ text }: { text: string }) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4" />
                <p className="text-gray-600">{text}</p>
            </div>
        </div>
    );
}

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const router = useRouter();
    const dispatch = useDispatch();

    const { accessToken, role, userId } = useSelector(
        (state: RootState) => state.auth
    );

    const isDoctor = role?.toLowerCase() === "doctor";
    const isAuthenticated = !!accessToken && isDoctor && !!userId;

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

       const tokenLS = localStorage.getItem("accessToken");
       if (!tokenLS) router.replace("/login");

        if (!isAuthenticated) {
            router.replace("/login");
        } else {
            setCheckingAuth(false);
        }
    }, [mounted, isAuthenticated, router]);

    const { data: profileResp, isFetching, isError } = useGetDoctorProfileQuery(
        userId as string,
        { skip: !isAuthenticated }
    );

    useEffect(() => {
        if (isError) {
            dispatch(logout());
            router.replace("/login");
        }
    }, [isError, dispatch, router]);

    if (!mounted || checkingAuth) {
        return <CenterSpinner text="Đang kiểm tra xác thực..." />;
    }
    if (isFetching) {
        return <CenterSpinner text="Đang tải thông tin bác sĩ..." />;
    }
    const profileData = profileResp?.data as DoctorProfile;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header doctorInfo={profileData} />
            <div className="flex">
                <Sidebar doctorInfo={profileData} />
                <main className="flex-1 ml-64">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="p-6"
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    );
}