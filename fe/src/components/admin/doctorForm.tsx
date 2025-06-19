'use client';

import React, { useEffect, useState } from 'react';
import { Form, Input, Row, Col, Button, Select, Upload, TimePicker, message } from 'antd';
import { ImageUp } from 'lucide-react';;
import axios from 'axios';

const { Option } = Select;

interface DoctorFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

const DoctorForm: React.FC<DoctorFormProps> = ({ onSuccess, onCancel }) => {
    const [form] = Form.useForm();
    const [specialties, setSpecialties] = useState<any[]>([]);

    useEffect(() => {
        const staticSpecialties = [
            { id: '6DD8D2A2-D6CA-4DCF-80E2-070CD920E8E2', title: 'Nội tổng quát' },
            { id: 'B212754F-E771-44C5-A161-0CCA770CCCC6', title: 'Xương khớp' },
            { id: '78CDCA79-172A-4DD9-A150-115C88E2E45B', title: 'Tim mạch' },
            { id: 'F1CD5A00-4BFB-4CFB-8F20-AD333A6089D4', title: 'Thần kinh' },
            { id: '129B653D-1C41-4D28-82AC-B59E9EA2BAE9', title: 'Nhi khoa' },
        ];
        setSpecialties(staticSpecialties);
    }, []);

    const onFinish = async (values: any) => {
        try {
            const startTime = values.time?.[0]?.format('HH:mm:ss') || '00:00:00';
            const endTime = values.time?.[1]?.format('HH:mm:ss') || '00:00:00';
            const fileObj = values.avatarFile?.[0]?.originFileObj;

            const slots = [
                {
                    Day: Number(values.day),
                    StartTime: startTime,
                    EndTime: endTime,
                    IsBooked: false,
                },
            ];

            const formData = new FormData();
            formData.append('FullName', values.fullName);
            formData.append('Username', values.username);
            formData.append('Password', values.password);
            formData.append('Email', values.email);
            formData.append('LicenseNumber', values.licenseNumber);
            formData.append('Biography', values.biography);
            formData.append('SpecialtyId', values.specialty);

            if (fileObj instanceof File) {
                formData.append('AvatarFile', fileObj);
            }

            slots.forEach((slot, index) => {
                formData.append(`Slots[${index}].Day`, slot.Day.toString());
                formData.append(`Slots[${index}].StartTime`, slot.StartTime);
                formData.append(`Slots[${index}].EndTime`, slot.EndTime);
                formData.append(`Slots[${index}].IsBooked`, slot.IsBooked.toString());
            });

            // for (const pair of formData.entries()) {
            //     console.log(`[FormData] ${pair[0]}:`, pair[1]);
            // }
            await axios.post('https://localhost:7115/api/Admin/doctor', formData);

            message.success('Tạo bác sĩ thành công!');
            form.resetFields();
            onSuccess();
        } catch (error: any) {
            if (error.response) {
                console.error('Lỗi server trả về:', error.response.status, error.response.data);
                message.error(`Tạo bác sĩ thất bại: ${error.response.data?.message || 'Lỗi không xác định'}`);
            } else {
                console.error('Lỗi khi gửi request:', error);
                message.error('Tạo bác sĩ thất bại!');
            }
        }
    };

    return (
        <Form layout="vertical" form={form} onFinish={onFinish} className="p-2 bg-gray-50 rounded-lg shadow-md">
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item name="fullName" label="Họ tên" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="username" label="Tên đăng nhập" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="password" label="Mật khẩu" rules={[{ required: true }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item name="licenseNumber" label="Số giấy phép hành nghề" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item name="specialty" label="Chuyên khoa" rules={[{ required: true }]}>
                        <Select placeholder="Chọn chuyên khoa">
                            {specialties
                                .filter(s => s.id && s.title)
                                .map(s => (
                                    <Option key={s.id} value={s.id}>
                                        {s.title}
                                    </Option>
                                ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="biography" label="Tiểu sử">
                        <Input.TextArea rows={5} />
                    </Form.Item>

                    <Form.Item
                        name="avatarFile"
                        label="Ảnh đại diện"
                        valuePropName="fileList"
                        getValueFromEvent={e => (Array.isArray(e) ? e : e?.fileList)}
                    >
                        <Upload beforeUpload={() => false} maxCount={1} listType="picture">
                            <Button icon={<ImageUp size={16} />}>Tải lên ảnh</Button>
                        </Upload>
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item name="day" label="Ngày làm việc" rules={[{ required: true }]}>
                        <Input type="number" min={0} max={6} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="time" label="Thời gian làm việc" rules={[{ required: true }]}>
                        <TimePicker.RangePicker format="HH:mm:ss" />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item className="text-center mt-4">
                <Button type="primary" htmlType="submit" className="mr-2">
                    Tạo bác sĩ
                </Button>
                <Button onClick={onCancel}>Hủy</Button>
            </Form.Item>
        </Form>
    );
};

export default DoctorForm;
