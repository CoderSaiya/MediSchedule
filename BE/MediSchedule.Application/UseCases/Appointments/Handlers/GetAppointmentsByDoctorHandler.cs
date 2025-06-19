using MediatR;
using MediSchedule.Application.DTOs;
using MediSchedule.Application.UseCases.Appointments.Queries;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Application.UseCases.Appointments.Handlers;

public class GetAppointmentsByDoctorHandler(IAppointmentRepository appointmentRepository) : IRequestHandler<GetAppointmentsByDoctorQuery, IEnumerable<AppointmentResponse>>
{
    public async Task<IEnumerable<AppointmentResponse>> Handle(GetAppointmentsByDoctorQuery request, CancellationToken cancellationToken) =>
        (await appointmentRepository.GetByDoctorIdAsync(request.DoctorId))
            .Select(a => new AppointmentResponse(
            Id: a.Id,
            DoctorId: a.DoctorId,
            SlotId: a.Slot.Id,
            FullName: a.FullName,
            Phone: a.Phone,
            Email: a.Email,
            AppointmentDate: a.AppointmentDate.ToString("yyyy-MM-dd"),
            AppointmentTime: a.AppointmentTime.ToString(@"hh\:mm\:ss"),
            FileUrl: a.FileUrl ?? "",
            Reason: a.Reason,
            Status: a.Status.ToString().ToLower(),
            Doctor: new DoctorDto(
                Id: a.DoctorId,
                Name: $"BS. {a.Doctor.Profile!.FullName!}",
                Speciality: a.Doctor.Specialty.Name
            ),
            Slot: new SlotDto(
                Day: a.Slot.Day,
                StartTime: a.Slot.StartTime,
                EndTime: a.Slot.EndTime,
                Id: a.SlotId,
                IsBooked: false
            )
        ));
}