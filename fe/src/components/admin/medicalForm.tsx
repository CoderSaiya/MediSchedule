'use client';

import React, {useEffect} from 'react';
import { Form, Input, Row, Col, Button, message } from 'antd';
import {useCreateMedicineMutation, useUpdateMedicineMutation} from '@/api';
import { MedicineDto } from '@/types/doctor';

interface MedicineFormProps {
    medicine?: MedicineDto | null;
    onSuccess: () => void;
    onCancel: () => void;
}

const MedicineForm: React.FC<MedicineFormProps> = ({ medicine, onSuccess, onCancel }) => {
    const [form] = Form.useForm();
    const [createMedicine, { isLoading: isCreating }] = useCreateMedicineMutation();
    const [updateMedicine, { isLoading: isUpdating }] = useUpdateMedicineMutation();

    useEffect(() => {
        if (medicine) {
            form.setFieldsValue({
                name: medicine.name,
                genericName: medicine.genericName,
                strength: medicine.strength,
                manufacturer: medicine.manufacturer,
                description: medicine.description || '',
            });
        } else {
            form.resetFields();
        }
    }, [medicine, form]);

    const onFinish = async (values: any) => {
        try {
            const formData = new FormData();

            formData.append('Name', values.name);
            formData.append('GenericName', values.genericName);
            formData.append('Strength', values.strength);
            formData.append('Manufacturer', values.manufacturer);
            formData.append('Description', values.description || '');

            if (medicine) {
                formData.append('Id', medicine.id);
                await updateMedicine(formData).unwrap();
                message.success('Cập nhật thuốc thành công!');
            }else {
                await createMedicine(formData).unwrap();
                message.success('Thêm thuốc thành công!');
            }
            form.resetFields();
            onSuccess();
        } catch (error: any) {
            console.error('Lỗi khi thêm thuốc:', error);
            const errorMsg =
                error?.data?.message ||
                error?.error ||
                (medicine ? 'Cập nhật thất bại!' : 'Thêm mới thất bại!');
            message.error(errorMsg);
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="p-6 bg-white rounded-lg shadow-md"
        >
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item name="name" label="Tên thuốc" rules={[{ required: true }]}>
                        <Input placeholder="Tên thuốc"/>
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
                <Button onClick={onCancel}>Hủy</Button>
                <Button type="primary" htmlType="submit" loading={isCreating || isUpdating}>
                    {medicine ? 'Cập nhật' : 'Thêm  thuốc'}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default MedicineForm;
