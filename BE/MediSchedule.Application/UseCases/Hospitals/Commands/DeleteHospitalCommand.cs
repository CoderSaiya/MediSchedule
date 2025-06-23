using MediatR;

namespace MediSchedule.Application.UseCases.Hospitals.Commands;

public record DeleteHospitalCommand(Guid HospitalId) : IRequest<Unit>;