'use client'

import {createContext, useContext, useEffect, useState} from "react";
import {useRouter} from "next/navigation";

interface IAdminContext {
    collapseMenu: boolean;
    setCollapseMenu: (v: boolean) => void;
}

export const AdminContext = createContext<IAdminContext | null>(null);

export const AdminContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [collapseMenu, setCollapseMenu] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        const role = localStorage.getItem("role");
        if (!userId || !role || role.toLowerCase() !== "admin") {
            router.push("/login");
        }
    }, [router]);

    return (
        <AdminContext.Provider value={{ collapseMenu, setCollapseMenu }}>
            {children}
        </AdminContext.Provider>
    )
};

export const useAdminContext = () => useContext(AdminContext);