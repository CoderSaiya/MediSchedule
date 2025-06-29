using System.Globalization;
using MediatR;
using MediSchedule.Application.DTOs;
using MediSchedule.Application.UseCases.Appointments.Queries;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Application.UseCases.Appointments.Handlers;

public class GetAppointmentsByDateHandler(IAppointmentRepository appointmentRepository) : IRequestHandler<GetAppointmentsByDateQuery, IEnumerable<TodayAppointmentResponse>>
{
    public async Task<IEnumerable<TodayAppointmentResponse>> Handle(GetAppointmentsByDateQuery request, CancellationToken cancellationToken) =>
        (await appointmentRepository.GetByDateAsync(request.Date)).Select(a => new TodayAppointmentResponse(
            Patient: a.FullName,
            Doctor: a.Doctor.Profile!.FullName!,
            Phone: a.Phone,
            Speciality: a.Doctor.Specialty.Name,
            TimeSlot: $"{a.AppointmentTime:hh\\:mm} {a.AppointmentDate.ToString("dd MMMM yyyy", new CultureInfo("vi-VN"))}",
            Status: a.Status.ToString()
            ));
}