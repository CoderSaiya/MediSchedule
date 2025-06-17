'use client';

import { Table, Button, Modal } from 'antd';
import { useEffect, useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import { Plus, Trash2, Pencil } from 'lucide-react';
import MedicineForm from '@/components/admin/medicalForm'
const MedicalTable = () => {
    const [medicines, setMedicines] = useState<any[]>([]);
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
            title: 'Tên thuốc',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
            width: '15%',
        },
        {
            title: 'Hoạt chất',
            dataIndex: 'genericName',
            key: 'genericName',
            align: 'center',
            width: '15%',
        },
        {
            title: 'Hàm lượng',
            dataIndex: 'strength',
            key: 'strength',
            align: 'center',
            width: '10%',
        },
        {
            title: 'Hãng sản xuất',
            dataIndex: 'manufacturer',
            key: 'manufacturer',
            align: 'center',
            width: '15%',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            align: 'center',
            width: '30%',
        },
        {
            title: 'Tính năng',
            key: 'actions',
            align: 'center',
            width: '20%',
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

    const fetchMedicines = async () => {
        try {
            const response = await axios.get('https://localhost:7115/api/Doctor/medicines');
            setMedicines(response.data.data);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu thuốc:", error);
        }
    };

    useEffect(() => {
        fetchMedicines();
    }, []);

    return (
        <>
            <div className="flex justify-between items-center mb-5">
                <span className="text-teal-500 font-semibold text-lg">Danh sách Thuốc</span>
                <Button className="bg-blue-500 text-white hover:!bg-blue-600 hover:!text-white flex items-center gap-1"
                    onClick={() => setShowForm(true)}
                >

                    <Plus size={16} /> Thêm thuốc
                </Button>
            </div>

            <Table
                bordered
                dataSource={medicines}
                columns={columns}
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
                title="Thêm thuốc mới"
                open={showForm}
                onCancel={() => setShowForm(false)}
                footer={null}
                width={700}
            >
                <MedicineForm
                    onSuccess={() => {
                        setShowForm(false);
                        fetchMedicines();
                    }}
                    onCancel={() => setShowForm(false)}
                />
            </Modal>

        </>
    );
};

export default MedicalTable;
