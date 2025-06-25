'use client';

import {Table, Button, Modal, message, Popconfirm} from 'antd';
import { useEffect, useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { Plus, Trash2, Pencil } from 'lucide-react';
import MedicineForm from '@/components/admin/medicalForm'
import {useDeleteMedicineMutation, useGetMedicinesQuery} from '@/api';
import { MedicineDto } from '@/types/doctor';

const MedicalTable = () => {
    const [showForm, setShowForm] = useState(false);
    const [editingMedicine, setEditingMedicine] = useState<MedicineDto | null>(null);

    const { data: medicineRes, isLoading, refetch } = useGetMedicinesQuery();
    const medicines = medicineRes?.data || []

    const [deleteMedicine, { isLoading: isDeleting }] = useDeleteMedicineMutation();

    const handleAdd = () => {
        setEditingMedicine(null);
        setShowForm(true);
    };

    const handleEdit = (medicine: MedicineDto) => {
        setEditingMedicine(medicine);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteMedicine(id).unwrap();
            message.success('Xóa thuốc thành công');
            refetch();
        } catch (error) {
            console.error(error);
            message.error('Xóa thuốc thất bại');
        }
    };

    const columns: ColumnsType<MedicineDto> = [
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
            render: (_, record) => (
                <div className="flex justify-center gap-2">
                    <Button
                        className="flex items-center gap-1 px-3 py-1 bg-yellow-400 text-white hover:!bg-yellow-500"
                        onClick={() => handleEdit(record)}
                    >
                        <Pencil size={16} /> Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc muốn xóa?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Có"
                        cancelText="Hủy"
                        >
                        <Button
                            loading={isDeleting}
                            className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white hover:!bg-red-600"
                        >
                            <Trash2 size={16} /> Xoá
                        </Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <>
            <div className="flex justify-between items-center mb-5">
                <span className="text-teal-500 font-semibold text-lg">Danh sách Thuốc</span>
                <Button className="bg-blue-500 text-white hover:!bg-blue-600 hover:!text-white flex items-center gap-1"
                    onClick={handleAdd}
                >

                    <Plus size={16} /> Thêm thuốc
                </Button>
            </div>

            <Table
                bordered
                dataSource={medicines}
                columns={columns}
                loading={isLoading}
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
                title={editingMedicine ? 'Chỉnh sửa thuốc' : 'Thêm thuốc mới'}
                open={showForm}
                onCancel={() => {
                    setShowForm(false);
                    setEditingMedicine(null);
                }}
                footer={null}
                width={700}
                destroyOnHidden
            >
                <MedicineForm
                    medicine={editingMedicine}
                    onSuccess={() => {
                        setShowForm(false);
                        setEditingMedicine(null);
                        refetch();
                    }}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingMedicine(null);
                    }}
                />
            </Modal>

        </>
    );
};

export default MedicalTable;
