'use client'

import { AdminContext } from '@/components/admin/context';
import { Button, Layout } from 'antd';
import { useContext } from 'react';
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';

import { ChevronLeft, ChevronRight, ChevronDown, Smile } from 'lucide-react';

const AdminHeader = () => {
    const { Header } = Layout;
    const { collapseMenu, setCollapseMenu } = useContext(AdminContext)!;

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <a target="_blank" href="#">
                    Trang cá nhân
                </a>
            ),
        },

        {
            key: '2',
            danger: true,
            label: 'Đăng xuất',
        },
    ];

    return (
        <Header className="p-0 flex justify-between items-center bg-white shadow-md z-10">
            <Button
                type="text"
                icon={collapseMenu ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                onClick={() => setCollapseMenu(!collapseMenu)}
                className="text-base w-16 h-16  text-teal-500 hover:!bg-teal-500 hover:!text-white "
            />
            <Dropdown menu={{ items }}>
                <a
                    onClick={(e) => e.preventDefault()}
                    className="mr-5 text-inherit"
                >
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
