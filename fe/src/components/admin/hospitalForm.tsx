'use client';

import React from 'react';
import { Form, Input, Row, Col, Button, Upload, message } from 'antd';
import { ImageUp } from 'lucide-react';
import axios from 'axios';

interface HospitalFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

const HospitalForm: React.FC<HospitalFormProps> = ({ onSuccess, onCancel }) => {
    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        try {
            const formData = new FormData();
            const fileObj = values.image?.[0]?.originFileObj;

            formData.append('Name', values.name);
            formData.append('Address', values.address);
            formData.append('Phone', values.phone);
            formData.append('Email', values.email);
            formData.append('Description', values.description || '');
            formData.append('Latitude', values.latitude);
            formData.append('Longitude', values.longitude);

            if (fileObj instanceof File) {
                formData.append('File', fileObj);
            }

            await axios.post('https://localhost:7115/api/Admin/hospital', formData);

            message.success('Thêm bệnh viện thành công!');
            form.resetFields();
            onSuccess();
        } catch (error: any) {
            console.error('Lỗi khi gửi request:', error);
            message.error('Thêm bệnh viện thất bại!');
        }
    };

    return (
        <Form
            layout="vertical"
            form={form}
            onFinish={onFinish}
            className="p-6 bg-gray-50 rounded-lg shadow-md"
        >
            <Row gutter={16}>

                <Col span={12}>
                    <Form.Item name="name" label="Tên bệnh viện" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="address" label="Địa chỉ" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="image"
                        label="Ảnh đại diện"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                    >
                        <Upload beforeUpload={() => false} maxCount={1} listType="picture">
                            <Button icon={<ImageUp size={16} />}>Tải lên ảnh</Button>
                        </Upload>
                    </Form.Item>

                </Col>


                <Col span={12}>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                        <Input />
                    </Form.Item>


                    <Form.Item name="latitude" label="Latitude" rules={[{ required: true }]}>
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item name="longitude" label="Longitude" rules={[{ required: true }]}>
                        <Input type="number" />
                    </Form.Item>


                    <Form.Item name="description" label="Mô tả">
                        <Input.TextArea rows={5} />
                    </Form.Item>
                </Col>
            </Row>



            <Form.Item className="text-center mt-4">
                <Button type="primary" htmlType="submit" className="mr-2">
                    Thêm bệnh viện
                </Button>
                <Button onClick={onCancel}>Hủy</Button>
            </Form.Item>
        </Form>

    );
};

export default HospitalForm;
