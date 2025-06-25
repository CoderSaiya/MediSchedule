'use client';
import {Button, Table, Rate, message, Popconfirm} from 'antd';
import { useEffect, useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import DoctorForm from '@/components/admin/doctorForm';
import { Modal } from 'antd';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import {useDeleteDoctorMutation, useGetDoctorsQuery} from '@/api';
import { Doctor } from "@/types/user";
import DoctorAppointments from '@/components/admin/doctorAppointments';
const DoctorTable = () => {
    const [showForm, setShowForm] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

    const { data: doctorRes, isLoading, refetch } = useGetDoctorsQuery();
    const doctors = doctorRes?.data || [];

    const [deleteDoctor, { isLoading: isDeleting }] = useDeleteDoctorMutation();

    const handleAdd = () => {
        setEditingDoctor(null);
        setShowForm(true);
    };
    const handleEdit = (doc: Doctor) => {
        setEditingDoctor(doc);
        setShowForm(true);
    };
    const handleDelete = async (id: string) => {
        try {
            await deleteDoctor(id).unwrap();
            message.success('Xóa bác sĩ thành công');
        } catch (error) {
            console.error(error);
            message.error('Xóa bác sĩ thất bại');
        }
    };

    const columns: ColumnsType<Doctor> = [
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
            render: (image: string) => {
                if (!image || image.trim() === '') {
                    return (
                        <div className="w-20 h-20 bg-gray-200 rounded-md mx-auto border flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No Image</span>
                        </div>
                    );
                }

                return (
                    <img
                        src={image}
                        alt="Doctor"
                        className="w-20 h-20 object-cover rounded-md mx-auto border"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                                parent.innerHTML = '<div class="w-20 h-20 bg-gray-200 rounded-md mx-auto border flex items-center justify-center"><span class="text-gray-400 text-xs">No Image</span></div>';
                            }
                        }}
                    />
                );
            },
        },
        {
            title: 'Tên bác sĩ',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
            width: '15%',
        },
        {
            title: 'Chuyên khoa',
            dataIndex: 'specialty',
            key: 'specialty',
            align: 'center',
            width: '10%',
        },
        {
            title: 'Đánh giá',
            dataIndex: 'rating',
            key: 'rating',
            align: 'center',
            width: '15%',
            render: (rating: number) => (
                <Rate allowHalf disabled defaultValue={rating || 0} />
            ),
        },
        {
            title: 'Lượt đánh giá',
            dataIndex: 'reviews',
            key: 'reviews',
            align: 'center',
            width: '10%',
            render: (reviews: number) => (
                <span>{reviews || 0} </span>
            ),
        },

        {
            title: 'Lịch làm việc',
            key: 'appointments',
            align: 'center',
            width: '25%',
            render: (_, record) => <DoctorAppointments doctorId={record.id} />,
        },
        {
            title: 'Tính năng',
            key: 'actions',
            align: 'center',
            width: '10%',
            render: (_, record) => (
                <div className="flex justify-center gap-2">
                    <Button
                        className="flex items-center justify-center gap-1 px-3 py-1 bg-yellow-400 text-white hover:!bg-yellow-500"
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
                            className="flex items-center justify-center gap-1 px-3 py-1 bg-red-500 text-white hover:!bg-red-600"
                        >
                            <Trash2 size={16} /> Xóa
                        </Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <>
            <div className="flex justify-between items-center mb-5">
                <span className="text-teal-500 font-semibold">Danh sách Bác sĩ</span>
                <Button
                    className="bg-blue-500 text-white hover:!bg-blue-600 hover:!text-white"
                    onClick={handleAdd}
                >
                    <Plus size={16} /> Tạo mới bác sĩ
                </Button>
            </div>

            <Table
                bordered
                dataSource={doctors}
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
                title={editingDoctor ? 'Chỉnh sửa bác sĩ' : 'Tạo bác sĩ mới'}
                open={showForm}
                onCancel={() => { setShowForm(false); setEditingDoctor(null); }}
                footer={null}
                width={800}
                destroyOnHidden
                style={{ top: 20 }}
            >
                <DoctorForm
                    doctor={editingDoctor}
                    onSuccess={() => {
                        setShowForm(false);
                        setEditingDoctor(null);
                        refetch();
                    }}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingDoctor(null);
                    }}
                />
            </Modal>


        </>
    );
};

export default DoctorTable;
