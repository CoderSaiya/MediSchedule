'use client';
import { Button, Table, Rate } from 'antd';
import { useEffect, useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import DoctorForm from '@/components/admin/doctorForm';
import { Modal } from 'antd';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';


const DoctorTable = () => {
    const [doctors, setDoctors] = useState<any[]>([]);
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
            width: '15%',
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
            width: '15%',
            render: (reviews: number) => (
                <span>{reviews || 0} nhận xét</span>
            ),
        },

        {
            title: 'Lịch làm việc',
            key: 'appointments',
            render: (text: any) => (
                <div>
                    {text.appointments.length > 0 ? (
                        <div className="space-y-2 ">
                            {text.appointments.map((appointment: any, index: number) => {
                                const startTime = appointment.slot?.startTime || "Chưa có giờ bắt đầu";
                                const endTime = appointment.slot?.endTime || "Chưa có giờ kết thúc";
                                return (
                                    <div key={index} className="p-2 border rounded-lg bg-teal-400">
                                        <div>{`Ngày: ${appointment.appointmentDate}`}</div>
                                        <div>{`Giờ: ${startTime} - ${endTime}`}</div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <span>Chưa có lịch làm việc</span>
                    )}
                </div>
            ),
            align: 'center',
            width: '20%',
        },
        {
            title: 'Tính năng',
            key: 'actions',
            align: 'center',
            width: '25%',
            render: () => (
                <div className="flex justify-center gap-2">
                    <Button
                        className="flex items-center justify-center gap-1 px-3 py-1 bg-yellow-400 text-white hover:!bg-yellow-500 hover:!text-white"
                    >
                        <Pencil size={16} /> Sửa
                    </Button>

                    <Button
                        className="flex items-center justify-center gap-1 px-3 py-1 bg-red-500 text-white hover:!bg-red-600 hover:!text-white"
                    >
                        <Trash2 size={16} /> Xoá
                    </Button>
                </div>
            ),
        },
    ];

    const fetchDoctors = async () => {
        try {
            const response = await axios.get('https://localhost:7115/api/Public/doctors');
            const doctorsWithAppointments = await Promise.all(response.data.data.map(async (doctor: any) => {
                const appointmentResponse = await axios.get(
                    `https://localhost:7115/api/Doctor/appointments/${doctor.id}`
                );
                return {
                    ...doctor,
                    appointments: appointmentResponse.data.data,
                };
            }));


            setDoctors(doctorsWithAppointments);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu bác sĩ:", error);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    return (
        <>
            <div className="flex justify-between items-center mb-5">
                <span className="text-teal-500 font-semibold">Danh sách Bác sĩ</span>
                <Button
                    className="bg-blue-500 text-white hover:!bg-blue-600 hover:!text-white"
                    onClick={() => setShowForm(true)}
                >
                    <Plus size={16} /> Tạo mới bác sĩ
                </Button>
            </div>

            <Table
                bordered
                dataSource={doctors}
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
                title="Tạo bác sĩ mới"
                open={showForm}
                onCancel={() => setShowForm(false)}
                footer={null}
                width={800}
                destroyOnHidden
                style={{ top: 20 }}
            >
                <DoctorForm
                    onSuccess={() => {
                        setShowForm(false);
                        fetchDoctors();
                    }}
                    onCancel={() => setShowForm(false)}
                />
            </Modal>


        </>
    );
};

export default DoctorTable;
