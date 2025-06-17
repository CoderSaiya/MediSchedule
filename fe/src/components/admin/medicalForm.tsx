'use client';

import React from 'react';
import { Form, Input, Row, Col, Button, message } from 'antd';
import axios from 'axios';

interface MedicineFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

const MedicineForm: React.FC<MedicineFormProps> = ({ onSuccess, onCancel }) => {
    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        try {
            await axios.post('https://localhost:7115/api/Admin/medicine', values);
            message.success('Thêm thuốc thành công!');
            form.resetFields();
            onSuccess();
        } catch (error: any) {
            if (error.response) {
                message.error(`Lỗi: ${error.response.data?.message || 'Không xác định'}`);
            } else {
                message.error('Thêm thuốc thất bại!');
            }
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="p-6 bg-gray-50 rounded-lg shadow-md"
        >
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item name="name" label="Tên thuốc" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="genericName" label="Hoạt chất" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="strength" label="Hàm lượng" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item name="manufacturer" label="Hãng sản xuất" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Mô tả">
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item className="text-center mt-4">
                <Button type="primary" htmlType="submit" className="mr-2">
                    Thêm thuốc
                </Button>
                <Button onClick={onCancel}>Hủy</Button>
            </Form.Item>
        </Form>
    );
};

export default MedicineForm;
