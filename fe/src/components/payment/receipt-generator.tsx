'use client'

import { Button, Table } from "antd"
import { useEffect, useState } from 'react';
import axios from 'axios';
import type { ColumnsType } from 'antd/es/table';


interface User {
    id: string;
    fullName: string;
    email: string;
    status: string;
    phoneNumber: string;
    address: string;
    dob: string;
    avatarUrl: string;
}

const UserTable = () => {
    const [users, setUsers] = useState<User[]>([]);

    const dataSource: User[] = [
        {
            id: '1',
            fullName: 'Nguyễn Văn A',
            email: 'A@gmail.com',
            status: 'Active',
            phoneNumber: '0123456789',
            address: '10 Võ Oanh',
            dob: '01-01-1980',
            avatarUrl: '../imgs/patient2.png',
        },
        {
            id: '2',
            fullName: 'Bình Gà',
            email: 'BG@gmail.com',
            status: 'Inactive',
            phoneNumber: '0147258369',
            address: '20 Võ Oanh',
            dob: '01-01-1980',
            avatarUrl: '../imgs/patient1.png',
        },
    ];


    const columns: ColumnsType<User> = [
        {
            title: 'Họ và tên',
            dataIndex: 'fullName',
            key: 'fullName',
            width: '20%',
            align: 'center',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: '20%',
            align: 'center',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            width: '10%',
            align: 'center',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
            width: '24%',
            align: 'center',
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'dob',
            key: 'dob',
            width: '10%',
            align: 'center',
        },
        {
            title: 'Avatar',
            dataIndex: 'avatarUrl',
            key: 'avatarUrl',
            width: '8%',
            render: (url: string) => <img src={url} alt="Avatar" style={{ width: 50, height: 50, borderRadius: '50%' }} />,
            align: 'center',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (text: string) => (
                <span>{text === 'Active' ? 'On' : 'Off'}</span>
            ),
            width: '8%',
            align: 'center',
        },
    ];

    useEffect(() => {
        /*
       const fetchUsers = async () => {
           try {
               const response = await axios.get('/api/admin/users');
               setUsers(response.data.data);  
           } catch (error) {
               console.error("Lỗi khi lấy dữ liệu người dùng:", error);
           }
       };
       fetchUsers();
       */
        // mock data
        setUsers(dataSource);
    }, []);

    return (
        <>
            <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20
            }}>
                <span>Quản lý Người dùng</span>
            </div>
            <Table
                bordered
                dataSource={users}
                columns={columns}
                scroll={{ x: 1000 }}
            />
        </>
    );
}

export default UserTable;
