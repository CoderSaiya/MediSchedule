'use client'

import { Layout } from "antd";

const AdminContent = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    const { Content } = Layout;

    return (
        <Content>
            <div className="p-6">
                {children}
            </div>
        </Content>
    );
};

export default AdminContent;
