using MediatR;
using MediSchedule.Application.DTOs;
using MediSchedule.Domain.Entities;

namespace MediSchedule.Application.UseCases.Doctors.Commands;

public record CreateDoctorCommand(CreateDoctorRequest Request) : IRequest<Unit>;