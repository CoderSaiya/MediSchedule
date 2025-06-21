'use client';
import { Spin, Pagination } from 'antd';
import { useState, useMemo } from 'react';
import { useGetAppointmentsByDoctorQuery } from '@/api';

interface Props {
    doctorId: string;
}

const DoctorAppointmentsCell = ({ doctorId }: Props) => {
    const { data, isLoading, isError } = useGetAppointmentsByDoctorQuery(doctorId);
    const appointments = data?.data || [];

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 1;

    const sortedAppointments = useMemo(() => {
        return [...appointments].sort((a, b) =>
            new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime()
        );
    }, [appointments]);

    const startIndex = (currentPage - 1) * pageSize;
    const currentAppointments = sortedAppointments.slice(startIndex, startIndex + pageSize);

    if (isLoading) return <div className="flex justify-center"><Spin size="small" /></div>;
    if (isError || sortedAppointments.length === 0) return <span>Chưa có lịch</span>;

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="w-full rounded-xl shadow-sm bg-teal-100 p-3 text-base text-gray-700 flex flex-col gap-1.5">
                <div><span className="font-semibold">Ngày:</span> {currentAppointments[0].appointmentDate}</div>
                <div><span className="font-semibold">Giờ:</span> {currentAppointments[0].slot?.startTime || "?"} - {currentAppointments[0].slot?.endTime || "?"}</div>
                <div><span className="font-semibold">Bệnh nhân:</span> {currentAppointments[0].fullName}</div>
            </div>

            <Pagination
                simple
                size="small"
                current={currentPage}
                total={sortedAppointments.length}
                pageSize={pageSize}
                onChange={setCurrentPage}
                className="text-xs"
            />
        </div>
    );
};

export default DoctorAppointmentsCell;
