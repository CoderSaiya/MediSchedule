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

type MenuItem = Required<MenuProps>['items'][number];

const AdminSideBar = () => {
    const { Sider } = Layout;
    const { collapseMenu } = useContext(AdminContext)!;

    const items: MenuItem[] = [
        {
            key: 'grp-dashboard',
            label: (
                <div className="h-12 flex items-center justify-center text-black font-semibold text-base border-b border-gray-300">
                    {collapseMenu ? 'MS' : 'MediSchedule'}
                </div>
            ),
            type: 'group',
            children: [
                {
                    key: "dashboard",
                    label: <Link href={"/dashboard"}>Bảng điều khiển</Link>,
                    icon: <LayoutDashboard size={18} />,
                },
            ],
        },
        {
            key: 'grp-users',
            label: 'Quản lý Người dùng',
            type: 'group',
            children: [
                {
                    key: "users",
                    label: <Link href={"/dashboard/user"}>Bệnh nhân</Link>,
                    icon: <User size={18} />,
                },
                {
                    key: "doctors",
                    label: <Link href={"/dashboard/doctor"}>Bác sĩ</Link>,
                    icon: <BriefcaseMedical size={18} />,
                },
            ],
        },
        {
            key: 'grp-medicine',
            label: 'Quản lý Thuốc',
            type: 'group',
            children: [
                {
                    key: "medicines",
                    label: <Link href={"/dashboard/medicine"}>Thuốc</Link>,
                    icon: <Pill size={18} />,
                },
            ],
        },
        {
            key: 'grp-hospitals',
            label: 'Quản lý Bệnh viện',
            type: 'group',
            children: [
                {
                    key: "hospitals",
                    label: <Link href={"/dashboard/hospital"}>Bệnh viện</Link>,
                    icon: <Hospital size={18} />,
                },
            ],
        },
        {
            key: 'grp-notifications',
            label: 'Thông báo',
            type: 'group',
            children: [
                {
                    key: "notifications",
                    label: <Link href={"/dashboard/notifications"}>Gửi thông báo</Link>,
                    icon: <Bell size={18} />,
                },
            ],
        },
        {
            key: 'grp-stats',
            label: 'Thống kê',
            type: 'group',
            children: [
                {
                    key: "db-stats",
                    label: <Link href={"/dashboard/db-stats"}>Thống kê CSDL</Link>,
                    icon: <LayoutDashboard size={18} />,
                },
                {
                    key: "sys-stats",
                    label: <Link href={"/dashboard/sys-stats"}>Thống kê Hệ thống</Link>,
                    icon: <LayoutDashboard size={18} />,
                },
            ],
        },
    ];

    return (
        <Sider collapsed={collapseMenu} className="h-screen shadow-md bg-white">
            <Menu
                mode="inline"
                defaultSelectedKeys={['dashboard']}
                items={items}
                className="h-full"
            />
        </Sider>
    );
};

export default AdminSideBar;
