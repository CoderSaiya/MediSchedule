'use client';
import { Form, Select, Input, Button, message } from 'antd';
import { useGetDoctorsQuery } from '@/api';
import { useNotificationHub } from '@/hooks/useNotificationHub';

interface Props {
    doctorId: string;
    onClose: () => void;
    refetch: () => void;
}

export default function NewNotificationForm({ doctorId, onClose, refetch }: Props) {
    const [form] = Form.useForm();
    const { data: doctorsResponse, isLoading: doctorsLoading } = useGetDoctorsQuery();
    const doctors = doctorsResponse?.data || [];

    const { sendNotification } = useNotificationHub(doctorId);

    const handleSubmit = async (values: any) => {
        const { targetDoctorId, type, content } = values;

        const success = await sendNotification([targetDoctorId], type, content);
        if (success) {
            message.success('Gửi thông báo thành công');
            form.resetFields();
            refetch();
            onClose();
        } else {
            message.error('Gửi thông báo thất bại');
        }
    };

    return (
        <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            initialValues={{ type: 'Email' }}
        >
            <Form.Item
                name="targetDoctorId"
                label="Chọn bác sĩ"
                rules={[{ required: true, message: 'Vui lòng chọn bác sĩ' }]}
            >
                <Select
                    loading={doctorsLoading}
                    placeholder="Chọn bác sĩ"
                    options={doctors.map(doc => ({
                        value: doc.id,
                        label: `${doc.name} (${doc.specialty})`,
                    }))}
                />
            </Form.Item>

            <Form.Item
                name="type"
                label="Loại thông báo"
                rules={[{ required: true, message: 'Vui lòng chọn loại thông báo' }]}
            >
                <Select>
                    <Select.Option value="Email">Email</Select.Option>
                    <Select.Option value="Sms">SMS</Select.Option>
                    <Select.Option value="Push">Push</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item
                name="content"
                label="Nội dung"
                rules={[{ required: true, message: 'Nội dung không được để trống' }]}
            >
                <Input.TextArea rows={4} placeholder="Nhập nội dung thông báo" />
            </Form.Item>

            <Form.Item>
                <div className="flex justify-end gap-2">
                    <Button onClick={onClose}>Hủy</Button>
                    <Button type="primary" htmlType="submit">
                        Gửi
                    </Button>
                </div>
            </Form.Item>
        </Form>
    );
}