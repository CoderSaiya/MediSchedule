'use client';

import { Button, Modal, Table } from 'antd';
import { useEffect, useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import { Pencil, Trash2, Plus } from 'lucide-react';
import HospitalForm from '@/components/admin/hospitalForm';

const HospitalTable = () => {
    const [hospitals, setHospitals] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);

    const fetchHospitals = async () => {
        try {
            const response = await axios.get('https://localhost:7115/api/Hospital');
            setHospitals(response.data.data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách bệnh viện:', error);
        }
    };

    useEffect(() => {
        fetchHospitals();
    }, []);

    const columns: ColumnsType<any> = [
        {
            title: 'STT',
            key: 'stt',
            render: (_, __, index) => index + 1,
            align: 'center',
            width: '5%',
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'image',
            key: 'image',
            align: 'center',
            width: '10%',
            render: (img: string) => (
                <img src={img} alt="hospital" className="w-14 h-14 object-cover rounded-md mx-auto" />
            ),
        },
        {
            title: 'Tên bệnh viện',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
            width: '20%',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
            align: 'center',
            width: '25%',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            align: 'center',
            width: '15%',
        },
        {
            title: 'SĐT',
            dataIndex: 'phone',
            key: 'phone',
            align: 'center',
            width: '15%',
        },
        {
            title: 'Thao tác',
            key: 'actions',
            align: 'center',
            width: '15%',
            render: () => (
                <div className="flex justify-center gap-2">
                    <Button className="flex items-center gap-1 px-3 py-1 bg-yellow-400 text-white hover:!bg-yellow-500">
                        <Pencil size={16} /> Sửa
                    </Button>
                    <Button className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white hover:!bg-red-600">
                        <Trash2 size={16} /> Xoá
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <div className="flex justify-between items-center mb-5">
                <span className="text-teal-500 font-semibold text-lg">Danh sách Bệnh viện</span>
                <Button
                    className="bg-blue-500 text-white hover:!bg-blue-600 hover:!text-white flex items-center gap-1"
                    onClick={() => setShowForm(true)}
                >
                    <Plus size={16} /> Thêm bệnh viện
                </Button>
            </div>

            <Table
                bordered
                dataSource={hospitals}
                columns={columns}
                rowKey="id"
                scroll={{ x: 1000 }}
                className="[&_.ant-table-cell]:!border-black 
                          [&_.ant-table-container]:!border-black
                          [&_.ant-table-thead>tr>th]:bg-teal-500
                          [&_.ant-table-tbody>tr:hover_td]:!bg-gray-200
                          [&_.ant-pagination-item-active>a]:!text-teal-500
                          [&_.ant-pagination-item]:!border-teal-500"
            />

            <Modal
                title="Thêm bệnh viện mới"
                open={showForm}
                onCancel={() => setShowForm(false)}
                footer={null}
                width={800}
                destroyOnHidden
                style={{ top: 20 }}
            >
                <HospitalForm
                    onSuccess={() => {
                        setShowForm(false);
                        fetchHospitals();
                    }}
                    onCancel={() => setShowForm(false)}
                />
            </Modal>
        </>
    );
};

export default HospitalTable;
