namespace MediSchedule.Application.DTOs;

public record TodayAppointmentResponse(
    string Patient,
    string Doctor,
    string Phone,
    string Speciality,
    string TimeSlot,
    string Status
    );