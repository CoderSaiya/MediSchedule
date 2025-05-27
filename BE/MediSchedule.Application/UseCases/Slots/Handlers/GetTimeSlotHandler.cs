using MediatR;
using MediSchedule.Application.DTOs;
using MediSchedule.Application.UseCases.Slots.Queries;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Application.UseCases.Slots.Handlers;

public class GetTimeSlotHandler(
    IAppointmentRepository appointmentRepository,
    ISlotRepository slotRepository
    ) : IRequestHandler<GetTimeSlotQuery, IEnumerable<TimeSlotResponse>>
{
    public async Task<IEnumerable<TimeSlotResponse>> Handle(GetTimeSlotQuery request, CancellationToken cancellationToken)
    {
        var date = request.Date;
        var day = date.DayOfWeek;
        var doctorId = request.DoctorId;
        var slots = await slotRepository.GetSlotsByDoctorAsync(doctorId, day);
        var bookedTimes = await appointmentRepository.GetBookedTimesAsync(doctorId, date.Date);

        return slots
            .OrderBy(s => s.StartTime)
            .Select(s => new TimeSlotResponse(
                Time: s.StartTime.ToString(@"hh\:mm"),
                IsBooked: bookedTimes.Contains(s.StartTime) || !s.IsAvailable
                ))
            .ToList();
    }
}