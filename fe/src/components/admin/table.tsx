'use client'

import { Button, Table } from "antd"

const UserTable = () => {
    const dataSource = [
        {
            key: '1',
            name: 'Mike',
            age: 32,
            address: '10 Downing Street',
        },
        {
            key: '2',
            name: 'John',
            age: 42,
            address: '10 Downing Street',
        },
    ];

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
    ];

    return (
        <>
            <div className="flex items-center justify-between mb-5">
                <span className="text-lg font-semibold">Manage Users</span>
                <Button type="primary">Create User</Button>
            </div>
            <Table
                bordered
                dataSource={dataSource}
                columns={columns}
            />
        </>
    )
}

export default UserTable;
