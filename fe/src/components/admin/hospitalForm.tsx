'use client';

import React, {useEffect, useState} from 'react';
import {Form, Input, Row, Col, Button, Upload, message, UploadFile, InputNumber} from 'antd';
import { ImageUp } from 'lucide-react';
import {useCreateHospitalMutation, useUpdateHospitalMutation} from '@/api';
import { Hospital } from '@/types/hospital';

interface HospitalFormProps {
    hospital?: Hospital | null;
    onSuccess: () => void;
    onCancel: () => void;
}

const HospitalForm: React.FC<HospitalFormProps> = ({ hospital, onSuccess, onCancel }) => {
    const [form] = Form.useForm();
    const [createHospital, { isLoading: isCreating }] = useCreateHospitalMutation();
    const [updateHospital, { isLoading: isUpdating }] = useUpdateHospitalMutation();

    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        if (hospital) {
            form.setFieldsValue({
                name: hospital.name,
                address: hospital.address,
                phone: hospital.phone,
                email: hospital.email,
                description: hospital.description || '',
                latitude: hospital.coordinates.latitude,
                longitude: hospital.coordinates.longitude,
            });
            if (hospital.image) {
                setFileList([
                    {
                        uid: '-1',
                        name: 'current-image',
                        status: 'done',
                        url: hospital.image,
                    },
                ]);
            } else {
                setFileList([]);
            }
        } else {
            form.resetFields();
            setFileList([]);
        }
    }, [hospital, form]);

    const beforeUpload = () => {
        // Ngăn Ant Design tự upload
        return false;
    };


    const onFinish = async (values: any) => {
        try {
            const formData = new FormData();

            formData.append('Name', values.name);
            formData.append('Address', values.address);
            formData.append('Phone', values.phone);
            formData.append('Email', values.email);
            formData.append('Description', values.description || '');
            formData.append('Latitude', String(values.latitude));
            formData.append('Longitude', String(values.longitude));

            if (hospital) {
                if (fileList.length > 0) {
                    const first = fileList[0];
                    if (first.originFileObj instanceof File) {
                        formData.append('Image', first.originFileObj);
                    }
                }
                formData.append('HospitalId', hospital.id);
                await updateHospital(formData).unwrap();
                message.success('Cập nhật bệnh viện thành công!');
            } else {
                if (fileList.length === 0 || !(fileList[0].originFileObj instanceof File)) {
                    message.error('Vui lòng chọn ảnh để tạo bệnh viện');
                    return;
                }
                formData.append('File', fileList[0].originFileObj);
                await createHospital(formData).unwrap();
                message.success('Thêm bệnh viện thành công!');
            }

            form.resetFields();
            setFileList([]);
            onSuccess();
        } catch (error: any) {
            console.error('Lỗi khi gửi request:', error);
            const errorMsg =
                error?.data?.message ||
                error?.error ||
                (hospital ? 'Cập nhật thất bại!' : 'Thêm mới thất bại!');
            message.error(errorMsg);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setFileList([]);
        onCancel();
    };

    return (
        <Form
            layout="vertical"
            form={form}
            onFinish={onFinish}
            className="p-6 bg-white rounded-lg shadow-md"
        >
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="name"
                        label="Tên bệnh viện"
                        rules={[{ required: true, message: 'Vui lòng nhập tên bệnh viện' }]}
                    >
                        <Input placeholder="Tên bệnh viện" />
                    </Form.Item>
                    <Form.Item
                        name="address"
                        label="Địa chỉ"
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                    >
                        <Input placeholder="Địa chỉ" />
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                    >
                        <Input placeholder="Số điện thoại" />
                    </Form.Item>

                    <Form.Item
                        name="image"
                        label="Ảnh đại diện"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                    >
                        <Upload
                            beforeUpload={beforeUpload}
                            maxCount={1}
                            listType="picture"
                            fileList={fileList}
                            onChange={({ fileList: newFileList }) => {
                                setFileList(newFileList);
                            }}
                            onRemove={() => {
                                setFileList([]);
                            }}
                        >
                            <Button icon={<ImageUp size={16} />}>Tải lên ảnh</Button>
                        </Upload>
                        <div style={{ marginTop: 4, color: 'rgba(0,0,0,0.45)' }}>
                            (Chọn để thay đổi hoặc thêm mới)
                        </div>
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email' },
                            { type: 'email', message: 'Email không hợp lệ' },
                        ]}
                    >
                        <Input placeholder="Email" />
                    </Form.Item>

                    <Form.Item
                        name="latitude"
                        label="Latitude"
                        rules={[{ required: true, message: 'Vui lòng nhập latitude' }]}
                    >
                        <InputNumber style={{ width: '100%' }} placeholder="Latitude" />
                    </Form.Item>

                    <Form.Item
                        name="longitude"
                        label="Longitude"
                        rules={[{ required: true, message: 'Vui lòng nhập longitude' }]}
                    >
                        <InputNumber style={{ width: '100%' }} placeholder="Longitude" />
                    </Form.Item>

                    <Form.Item name="description" label="Mô tả">
                        <Input.TextArea rows={5} placeholder="Mô tả (không bắt buộc)" />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item className="text-center mt-4">
                <>
                    <Button onClick={handleCancel} className="mr-2">
                        Hủy
                    </Button>
                    <Button type="primary" htmlType="submit" loading={isCreating || isUpdating}>
                        {hospital ? 'Cập nhật' : 'Thêm bệnh viện'}
                    </Button>
                </>
            </Form.Item>
        </Form>
    );
};

export default HospitalForm;
