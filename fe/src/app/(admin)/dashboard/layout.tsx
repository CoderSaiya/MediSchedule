import AdminContent from "@/components/admin/content";
import AdminHeader from "@/components/admin/header";
import AdminSideBar from "@/components/admin/sidebar";
import { AdminContextProvider } from '@/components/admin/context';

const AdminLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {

    return (
        <AdminContextProvider>
            <div className="flex h-screen">
                {/* Sidebar */}
                <div className="min-w-[80px]">
                    <AdminSideBar />
                </div>

                {/* Main content */}
                <div className="flex flex-col flex-1">
                    <AdminHeader />
                    <div className="flex-1 overflow-auto">
                        <AdminContent>{children}</AdminContent>
                    </div>
                </div>
            </div>
        </AdminContextProvider>
    );
};

export default AdminLayout;
