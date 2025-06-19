using MediatR;
using MediSchedule.Application.DTOs;

namespace MediSchedule.Application.UseCases.Hospitals.Commands;

public record CreateHospitalCommand(CreateHospitalRequest Request) : IRequest<Unit>;