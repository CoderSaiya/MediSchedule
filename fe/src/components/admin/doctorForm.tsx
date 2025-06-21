'use client';

import React, { useEffect, useState } from 'react';
import { Form, Input, Row, Col, Button, Select, Upload, TimePicker, message } from 'antd';
import { ImageUp } from 'lucide-react';
import { useCreateDoctorMutation } from '@/api';

const { Option } = Select;

interface DoctorFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

const DoctorForm: React.FC<DoctorFormProps> = ({ onSuccess, onCancel }) => {
    const [form] = Form.useForm();
    const [specialties, setSpecialties] = useState<any[]>([]);
    const [createDoctor, { isLoading }] = useCreateDoctorMutation();

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
            if (!values.fullName || !values.username || !values.password || !values.email ||
                !values.licenseNumber || !values.specialty || !values.day || !values.time) {
                message.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
                return;
            }

            const startTime = values.time?.[0]?.format('HH:mm:ss') || '08:00:00';
            const endTime = values.time?.[1]?.format('HH:mm:ss') || '17:00:00';
            const fileObj = values.avatarFile?.[0]?.originFileObj;

            const formData = new FormData();

            formData.append('FullName', values.fullName.trim());
            formData.append('Username', values.username.trim());
            formData.append('Password', values.password);
            formData.append('Email', values.email.trim());
            formData.append('LicenseNumber', values.licenseNumber.trim());
            formData.append('Biography', values.biography?.trim() || 'Chưa có thông tin');
            formData.append('SpecialtyId', values.specialty);

            if (fileObj instanceof File) {
                formData.append('AvatarFile', fileObj);
            } else {
                // Tạo empty file để tránh lỗi required
                const emptyFile = new File([''], 'empty.txt', { type: 'text/plain' });
                formData.append('AvatarFile', emptyFile);
            }

            const dayValue = parseInt(values.day);

            // Gửi slot data theo format backend expect
            formData.append('Slots[0].Day', dayValue.toString());
            formData.append('Slots[0].StartTime', startTime);
            formData.append('Slots[0].EndTime', endTime);

            console.log('=== FormData Debug ===');
            for (const pair of formData.entries()) {
                console.log(`${pair[0]}:`, pair[1]);
            }

            const result = await createDoctor(formData).unwrap();

            message.success('Tạo bác sĩ thành công!');
            form.resetFields();
            onSuccess();
        } catch (error: any) {
            console.error('Lỗi khi tạo bác sĩ:', error);

            let errorMessage = 'Tạo bác sĩ thất bại!';

            if (error?.data?.message) {
                errorMessage = error.data.message;
            } else if (error?.data?.errors) {
                const validationErrors = Object.values(error.data.errors).flat();
                errorMessage = validationErrors.join(', ');
            } else if (error?.message) {
                errorMessage = error.message;
            } else if (typeof error === 'string') {
                errorMessage = error;
            }
            message.error(errorMessage);
        }
    };

    return (
        <Form layout="vertical" form={form} onFinish={onFinish} className="p-2 bg-gray-50 rounded-lg shadow-md">
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="fullName"
                        label="Họ tên"
                        rules={[
                            { required: true, message: 'Vui lòng nhập họ tên' },
                            { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự' }
                        ]}
                    >
                        <Input placeholder="Nhập họ tên" />
                    </Form.Item>

                    <Form.Item
                        name="username"
                        label="Tên đăng nhập"
                        rules={[
                            { required: true, message: 'Vui lòng nhập tên đăng nhập' },
                            { min: 3, message: 'Tên đăng nhập phải có ít nhất 3 ký tự' }
                        ]}
                    >
                        <Input placeholder="Nhập tên đăng nhập" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email' },
                            { type: 'email', message: 'Email không hợp lệ' }
                        ]}
                    >
                        <Input placeholder="Nhập email" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Mật khẩu"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu' },
                            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
                        ]}
                    >
                        <Input.Password placeholder="Nhập mật khẩu" />
                    </Form.Item>

                    <Form.Item
                        name="licenseNumber"
                        label="Số giấy phép hành nghề"
                        rules={[{ required: true, message: 'Vui lòng nhập số giấy phép' }]}
                    >
                        <Input placeholder="Nhập số giấy phép" />
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item
                        name="specialty"
                        label="Chuyên khoa"
                        rules={[{ required: true, message: 'Vui lòng chọn chuyên khoa' }]}
                    >
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
                        <Input.TextArea rows={5} placeholder="Nhập tiểu sử bác sĩ" />
                    </Form.Item>

                    <Form.Item
                        name="avatarFile"
                        label="Ảnh đại diện"
                        valuePropName="fileList"
                        getValueFromEvent={e => (Array.isArray(e) ? e : e?.fileList)}
                    >
                        <Upload
                            beforeUpload={() => false}
                            maxCount={1}
                            listType="picture"
                            accept="image/*"
                        >
                            <Button icon={<ImageUp size={16} />}>Tải lên ảnh</Button>
                        </Upload>
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="day"
                        label="Ngày làm việc"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày làm việc' }]}
                    >
                        <Select placeholder="Chọn ngày trong tuần">
                            <Option value={0}>Chủ nhật</Option>
                            <Option value={1}>Thứ hai</Option>
                            <Option value={2}>Thứ ba</Option>
                            <Option value={3}>Thứ tư</Option>
                            <Option value={4}>Thứ năm</Option>
                            <Option value={5}>Thứ sáu</Option>
                            <Option value={6}>Thứ bảy</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="time"
                        label="Thời gian làm việc"
                        rules={[{ required: true, message: 'Vui lòng chọn thời gian làm việc' }]}
                    >
                        <TimePicker.RangePicker
                            format="HH:mm:ss"
                            placeholder={['Giờ bắt đầu', 'Giờ kết thúc']}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item className="text-center mt-4">
                <Button
                    type="primary"
                    htmlType="submit"
                    className="mr-2"
                    loading={isLoading}
                    size="large"
                >
                    Tạo bác sĩ
                </Button>
                <Button onClick={onCancel} size="large">
                    Hủy
                </Button>
            </Form.Item>
        </Form>
    );
};

export default DoctorForm;
