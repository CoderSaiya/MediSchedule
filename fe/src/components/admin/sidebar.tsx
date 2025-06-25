'use client'

import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import {
    LayoutDashboard,
    BriefcaseMedical,
    User,
    Pill,
    Hospital,
    Bell
} from 'lucide-react';

import React, { useContext } from 'react';
import { AdminContext } from "@/components/admin/context";
import type { MenuProps } from 'antd';
import Link from 'next/link';
import { group } from "console";

type MenuItem = Required<MenuProps>['items'][number];

const AdminSideBar = () => {
    const { Sider } = Layout;
    const { collapseMenu } = useContext(AdminContext)!;

    const items: MenuItem[] = [
        {
            key: 'app-name',
            label: (
                <div className="h-14 flex items-center justify-center text-white font-semibold text-xl border-b border-white">
                    {collapseMenu ? 'MS' : 'MediSchedule'}
                </div>
            ),
            type: 'group',
        },
        // Menu items
        {
            key: "dashboard",
            label: <Link href={"/admin/dashboard"}>Bảng điều khiển</Link>,
            icon: <LayoutDashboard size={18} />,
        },
        {
            key: "doctors",
            label: <Link href={"/admin/dashboard/doctor"}>Bác sĩ</Link>,
            icon: <BriefcaseMedical size={18} />,
        },
        {
            key: "medicines",
            label: <Link href={"/admin/dashboard/medical"}>Thuốc</Link>,
            icon: <Pill size={18} />,
        },
        {
            key: "hospitals",
            label: <Link href={"/admin/dashboard/hospital"}>Bệnh viện</Link>,
            icon: <Hospital size={18} />,
        },
        {
            key: "notifications",
            label: <Link href={"/admin/dashboard/notification"}>Thông báo</Link>,
            icon: <Bell size={18} />,
        },

    ];

    return (
        <Sider collapsed={collapseMenu} className="h-screen shadow-md ">
            <Menu
                mode="inline"
                defaultSelectedKeys={['dashboard']}
                items={items}
                className="h-full bg-gradient-to-b from-teal-500 to-teal-700 
                [&_.ant-menu-item]:text-white text-base font-medium
                [&_.ant-menu-item-selected]:bg-teal-800"
            />
        </Sider>
    );
};

export default AdminSideBar;
