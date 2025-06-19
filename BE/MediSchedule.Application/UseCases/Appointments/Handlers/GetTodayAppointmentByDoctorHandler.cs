using MediatR;
using MediSchedule.Application.DTOs;
using MediSchedule.Application.UseCases.Appointments.Queries;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Application.UseCases.Appointments.Handlers;

public class GetTodayAppointmentByDoctorHandler(IAppointmentRepository appointmentRepository) : IRequestHandler<GetTodayAppointmentByDoctorQuery, IEnumerable<AppointmentResponse>>
{
    public async Task<IEnumerable<AppointmentResponse>> Handle(GetTodayAppointmentByDoctorQuery request,
        CancellationToken cancellationToken)
    {
        DateTime today = DateTime.Today;
        
        return (await appointmentRepository.GetByDoctorIdAsync(request.DoctorId))
            .Where(a => a.CreatedAt >= today 
                        && a.CreatedAt < today.AddDays(1))
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
}