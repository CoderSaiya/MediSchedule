'use client'

import { AdminContext } from '@/components/admin/context';
import { Button, Layout, Dropdown, Space } from 'antd';
import type { MenuProps } from 'antd';
import { useContext } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { logout } from "@/store/slices/authSlice";
import { useLogoutMutation } from "@/api";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";

const AdminHeader = () => {
    const { Header } = Layout;
    const { collapseMenu, setCollapseMenu } = useContext(AdminContext)!;
    const [logoutMutation] = useLogoutMutation();
    const dispatch = useDispatch<AppDispatch>();

    const items: MenuProps['items'] = [
        {
            key: 'profile',
            label: (
                <a target="_blank" href="#">
                    Trang cá nhân
                </a>
            ),
        },
        {
            key: 'logout',
            danger: true,
            label: 'Đăng xuất',
        },
    ];

    const handleLogout = async () => {
        try {
            await logoutMutation().unwrap();
        } catch (error) {
            console.error("Logout error:", error);
        }
        dispatch(logout());
        window.location.href = "/login";
    };

    const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
        if (key === 'logout') {
            void handleLogout();
        }
    };

    return (
        <Header className="p-0 flex justify-between items-center bg-white shadow-md z-10">
            <Button
                type="text"
                icon={collapseMenu ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                onClick={() => setCollapseMenu(!collapseMenu)}
                className="text-base w-16 h-16 text-teal-500 hover:!bg-teal-500 hover:!text-white"
            />

            <Dropdown
                menu={{
                    items,
                    onClick: handleMenuClick
                }}
            >
                <a onClick={(e) => e.preventDefault()} className="mr-5 text-inherit">
                    <Space>
                        <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                            Chào mừng Admin
                        </span>
                        <ChevronDown
                            size={16}
                            className="text-teal-600"
                        />
                    </Space>
                </a>
            </Dropdown>
        </Header>
    );
};

export default AdminHeader;
