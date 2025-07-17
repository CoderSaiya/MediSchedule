'use client';

import React, { useEffect, useState } from 'react';
import {Form, Input, Row, Col, Button, Select, Upload, TimePicker, message, UploadFile, Space} from 'antd';
import { ImageUp } from 'lucide-react';
import {useCreateDoctorMutation, useGetHospitalsQuery, useGetSpecialtiesQuery, useUpdateDoctorMutation} from '@/api';
import {Doctor} from "@/types/user";
import dayjs from "dayjs";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";

const { Option } = Select;

interface DoctorFormProps {
    doctor?: Doctor | null;
    onSuccess: () => void;
    onCancel: () => void;
}

const DoctorForm: React.FC<DoctorFormProps> = ({ doctor, onSuccess, onCancel }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const [createDoctor, { isLoading: isCreating }] = useCreateDoctorMutation();
    const [updateDoctor, { isLoading: isUpdating }] = useUpdateDoctorMutation();

    const { data: specRes } = useGetSpecialtiesQuery();
    const specialties = specRes?.data || [];
    const { data: hospRes } = useGetHospitalsQuery();
    const hospitals = hospRes?.data || [];

    // useEffect(() => {
    //     const staticSpecialties = [
    //         { id: '6DD8D2A2-D6CA-4DCF-80E2-070CD920E8E2', title: 'Nội tổng quát' },
    //         { id: 'B212754F-E771-44C5-A161-0CCA770CCCC6', title: 'Xương khớp' },
    //         { id: '78CDCA79-172A-4DD9-A150-115C88E2E45B', title: 'Tim mạch' },
    //         { id: 'F1CD5A00-4BFB-4CFB-8F20-AD333A6089D4', title: 'Thần kinh' },
    //         { id: '129B653D-1C41-4D28-82AC-B59E9EA2BAE9', title: 'Nhi khoa' },
    //     ];
    //     setSpecialties(staticSpecialties);
    // }, []);

    useEffect(() => {
        if (doctor) {
            const matchedSpecialty = specialties.find(s => s.title === doctor.specialty);
            const matchedHospital = hospitals.find(h => h.name === doctor.hospital);

            form.setFieldsValue({
                fullName: doctor.name.replace(/^(BS\.?\s*)+/gi, '').trim(),
                username: doctor.username,
                password: '',
                email: doctor.email,
                specialty: matchedSpecialty?.id,
                hospital: matchedHospital?.id,
                licenseNumber: doctor.licenseNumber,
                biography: doctor.biography || '',
                slots: doctor.slots?.map(slot => ({
                    id: slot.id,
                    day: String(slot.day),
                    time: [
                        dayjs(slot.startTime, 'HH:mm:ss'),
                        dayjs(slot.endTime, 'HH:mm:ss')
                    ]
                })) || []
            });
            if (doctor.image) {
                setFileList([{
                    uid: '-1',
                    name: 'avatar',
                    status: 'done',
                    url: doctor.image,
                }]);
            } else {
                setFileList([]);
            }
        } else {
            form.resetFields();
            setFileList([]);
        }
    }, [doctor, form, specialties, hospitals]);

    const beforeUpload = () => false;

    const onFinish = async (values: any) => {
        try {
            if (!values.fullName || !values.licenseNumber || !values.specialty || !values.hospital) {
                message.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
                return;
            }

            if (doctor && values.password) {
                if (values.password.length < 6) {
                    message.error('Mật khẩu phải có ít nhất 6 ký tự');
                    return;
                }
            }

            if (!doctor) {
                if (!values.username || values.username.length < 3) {
                    message.error('Vui lòng nhập tên đăng nhập (ít nhất 3 ký tự)');
                    return;
                }
                if (!values.email) {
                    message.error('Vui lòng nhập email');
                    return;
                }
                if (!values.password || values.password.length < 6) {
                    message.error('Vui lòng nhập mật khẩu (ít nhất 6 ký tự)');
                    return;
                }
            }

            const slots: {
                id: string;
                day: string; time: [dayjs.Dayjs, dayjs.Dayjs] }[] = values.slots || [];
            if (slots.length === 0) {
                message.error('Vui lòng thêm ít nhất một lịch làm việc');
                return;
            }

            for (let i = 0; i < slots.length; i++) {
                const s = slots[i];
                if (!s.day) {
                    message.error(`Slot #${i + 1}: Chưa chọn ngày`);
                    return;
                }
                if (!s.time || s.time.length !== 2) {
                    message.error(`Slot #${i + 1}: chưa chọn thời gian`);
                    return;
                }
                const [start, end] = s.time;
                if (!end.isAfter(start)) {
                    message.error(`Slot #${i + 1}: EndTime phải sau StartTime`);
                    return;
                }
            }
            for (let i = 0; i < slots.length; i++) {
                for (let j = i + 1; j < slots.length; j++) {
                    if (
                        slots[i].day === slots[j].day &&
                        slots[i].time[0].isBefore(slots[j].time[1]) &&
                        slots[j].time[0].isBefore(slots[i].time[1])
                    ) {
                        message.error(`Slot ${i + 1} chồng lặp với slot ${j + 1}`);
                        return;
                    }
                }
            }

            const formData = new FormData();
            if (doctor) {
                formData.append('DoctorId', doctor.id);
            }
            if (doctor) {
                formData.append('DoctorId', doctor.id);
            }
            formData.append(
                'FullName',
                values.fullName.replace(/^BS\\.\\s*/i, '').trim()
            );
            if (!doctor) {
                formData.append('Username', values.username.trim());
                formData.append('Email', values.email.trim());
                formData.append('Password', values.password);
            } else if (values.password) {
                formData.append('Password', values.password);
            }

            const foundSpec = specialties.find(s => s.id === values.specialty);
            const specialtyId = foundSpec ? foundSpec.id : undefined;
            if (!specialtyId) {
                console.warn('Không tìm thấy ID chuyên khoa cho tên:', values.specialty);
            }
            formData.append('SpecialtyId', specialtyId as string);

            const foundHosp = hospitals.find(h => h.id === values.hospital);
            const hospitalId = foundHosp ? foundHosp.id : undefined;
            if (!hospitalId) {
                console.warn('Không tìm thấy ID bệnh viện cho tên:', values.hospital);
            }
            formData.append('HospitalId', hospitalId as string);
            formData.append('LicenseNumber', values.licenseNumber.trim());
            formData.append('Biography', values.biography?.trim() || '');

            const fileObj = values.avatarFile?.[0]?.originFileObj;
            if (fileObj instanceof File) {
                formData.append('AvatarFile', fileObj);
            } else if (!doctor) {
                const empty = new File([''], 'empty.png', { type: 'image/png' });
                formData.append('AvatarFile', empty);
            }

            slots.forEach((s, idx) => {
                if (s.id) {
                    formData.append(`Slots[${idx}].Id`, s.id);
                }
                formData.append(`Slots[${idx}].Day`, Number(s.day).toString());
                formData.append(`Slots[${idx}].StartTime`, s.time[0].format('HH:mm:ss'));
                formData.append(`Slots[${idx}].EndTime`, s.time[1].format('HH:mm:ss'));
            });

            if (doctor) {
                await updateDoctor(formData).unwrap();
                message.success('Cập nhật bác sĩ thành công!');
            } else {
                await createDoctor(formData).unwrap();
                message.success('Tạo bác sĩ thành công!');
            }
            form.resetFields();
            setFileList([]);
            onSuccess();
        } catch (error: any) {
            console.error('Lỗi khi lưu bác sĩ:', error);
            let errorMessage = doctor ? 'Cập nhật thất bại!' : 'Tạo thất bại!';
            if (error?.data?.message) {
                errorMessage = error.data.message;
            } else if (error?.data?.errors) {
                const validationErrors = Object.values(error.data.errors).flat();
                errorMessage = validationErrors.join(', ');
            } else if (error?.message) {
                errorMessage = error.message;
            }
            message.error(errorMessage);
        }
    };

    return (
        <Form layout="vertical" form={form} onFinish={onFinish} className="p-2 bg-white rounded-lg shadow-md">
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
                            { required: !doctor, message: 'Vui lòng nhập tên đăng nhập' },
                            { min: 3, message: 'Tên đăng nhập phải có ít nhất 3 ký tự' }
                        ]}
                    >
                        <Input placeholder="Nhập tên đăng nhập" disabled={!!doctor} />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: !doctor, message: 'Vui lòng nhập email' },
                            { type: 'email', message: 'Email không hợp lệ' }
                        ]}
                    >
                        <Input placeholder="Nhập email" disabled={!!doctor} />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Mật khẩu"
                        rules={[
                            { required: !doctor, message: 'Vui lòng nhập mật khẩu' },
                            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
                        ]}
                    >
                        <Input.Password placeholder={doctor ? "Nhập mật khẩu mới nếu muốn đổi" : "Nhập mật khẩu"} />
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
                            {specialties.map(s => (
                                <Option key={s.id} value={s.id}>{s.title}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="hospital"
                        label="Bệnh viện"
                        rules={[{ required: true, message: 'Vui lòng chọn bệnh viện' }]}
                    >
                        <Select placeholder="Chọn bệnh viện">
                            {hospitals.map(h => (
                                <Option key={h.id} value={h.id}>{h.name}</Option>
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
                            beforeUpload={beforeUpload}
                            maxCount={1}
                            listType="picture"
                            accept="image/*"
                            fileList={fileList}
                            onChange={({ fileList: newFileList }) => setFileList(newFileList)}
                            onRemove={() => setFileList([])}
                        >
                            <Button icon={<ImageUp size={16} />}>Tải lên ảnh</Button>
                        </Upload>
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.List name="slots">
                        {(fields, { add, remove }) => (
                            <div>
                                {fields.map((field, index) => (
                                    <Space
                                        key={field.key}
                                        style={{ display: 'flex', marginBottom: 8 }}
                                        align="baseline"
                                    >
                                        <Form.Item
                                            {...field}
                                            name={[field.name, 'id']}
                                            fieldKey={[field.fieldKey, 'id']}
                                            hidden
                                        >
                                            <Input />
                                        </Form.Item>

                                        <Form.Item
                                            {...field}
                                            name={[field.name, 'day']}
                                            fieldKey={[field.fieldKey, 'day']}
                                            rules={[{ required: true, message: 'Chọn ngày' }]}
                                        >
                                            <Select style={{ width: 120 }} placeholder="Ngày">
                                                <Option value="0">Chủ nhật</Option>
                                                <Option value="1">Thứ hai</Option>
                                                <Option value="2">Thứ ba</Option>
                                                <Option value="3">Thứ tư</Option>
                                                <Option value="4">Thứ năm</Option>
                                                <Option value="5">Thứ sáu</Option>
                                                <Option value="6">Thứ bảy</Option>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            {...field}
                                            name={[field.name, 'time']}
                                            fieldKey={[field.fieldKey, 'time']}
                                            rules={[{ required: true, message: 'Chọn giờ' }]}
                                        >
                                            <TimePicker.RangePicker format="HH:mm:ss" />
                                        </Form.Item>
                                        <MinusCircleOutlined onClick={() => remove(field.name)} />
                                    </Space>
                                ))}
                                <Form.Item>
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        block
                                        icon={<PlusOutlined />}
                                    >
                                        Thêm lịch làm việc
                                    </Button>
                                </Form.Item>
                            </div>
                        )}
                    </Form.List>
                </Col>
            </Row>

            <Form.Item className="text-center mt-4">
                <>
                    <Button type="default" onClick={() => { form.resetFields(); setFileList([]); onCancel(); }} className="mr-2">
                        Hủy
                    </Button>
                    <Button type="primary" htmlType="submit" loading={isCreating || isUpdating}>
                        {doctor ? 'Cập nhật' : 'Tạo bác sĩ'}
                    </Button>
                </>
            </Form.Item>
        </Form>
    );
};

export default DoctorForm;
