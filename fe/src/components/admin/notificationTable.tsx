'use client';
import { Button, Table } from 'antd';
import { useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { Modal } from 'antd';
import { Plus, Trash2 } from 'lucide-react';

// Dummy data
const notifications = [
    {
        id: '1',
        user: { fullName: 'Nguyễn Văn A', email: 'a@gmail.com' },
        type: 'Email',
        content: 'Hệ thống sẽ bảo trì vào lúc 23:00 hôm nay.',
        createdAt: new Date().toISOString(),
    },
    {
        id: '2',
        user: { fullName: 'Trần Thị B', email: 'b@gmail.com' },
        type: 'Sms',
        content: 'Đừng quên lịch khám ngày mai lúc 9:00.',
        createdAt: new Date().toISOString(),
    },
];

const NotificationTable = () => {
    const [showForm, setShowForm] = useState(false);

    const columns: ColumnsType<any> = [
        {
            title: 'STT',
            key: 'stt',
            render: (_, __, index) => index + 1,
            align: 'center',
            width: '5%',
        },
        {
            title: 'Người nhận',
            key: 'user',
            align: 'center',
            width: '20%',
            render: (_, record) => record.user?.fullName || record.user?.email || '---',
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            key: 'type',
            align: 'center',
            width: '10%',
        },
        {
            title: 'Nội dung',
            dataIndex: 'content',
            key: 'content',
            align: 'left',
            width: '40%',
        },
        {
            title: 'Ngày gửi',
            dataIndex: 'createdAt',
            key: 'createdAt',
            align: 'center',
            width: '15%',
            render: (value: string) => new Date(value).toLocaleString(),
        },
        {
            title: 'Tính năng',
            key: 'actions',
            align: 'center',
            width: '10%',
            render: () => (
                <div className="flex justify-center gap-2">
                    <Button
                        className="flex items-center justify-center gap-1 px-3 py-1 bg-red-500 text-white hover:!bg-red-600 hover:!text-white"
                    >
                        <Trash2 size={16} /> Xoá
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <div className="flex justify-between items-center mb-5">
                <span className="text-teal-500 font-semibold">Danh sách Thông báo</span>
                <Button
                    className="bg-blue-500 text-white hover:!bg-blue-600 hover:!text-white"
                    onClick={() => setShowForm(true)}
                >
                    <Plus size={16} /> Gửi thông báo
                </Button>
            </div>

            <Table
                bordered
                dataSource={notifications}
                columns={columns}
                loading={false}
                scroll={{ x: 1000 }}
                rowKey="id"
                className="[&_.ant-table-cell]:!border-black 
                        [&_.ant-table-container]:!border-black
                        [&_.ant-table-thead>tr>th]:bg-teal-500
                        [&_.ant-table-tbody>tr:hover_td]:!bg-gray-200
                        [&_.ant-pagination-item-active>a]:!text-teal-500
                        [&_.ant-pagination-item]:!border-teal-500"
            />

            <Modal
                title="Gửi thông báo mới"
                open={showForm}
                onCancel={() => setShowForm(false)}
                footer={null}
                width={700}
                destroyOnHidden
                style={{ top: 20 }}
            >
                <div className="text-gray-400 text-center py-10">Form gửi thông báo sẽ được hiển thị ở đây.</div>
            </Modal>
        </>
    );
};

export default NotificationTable;
