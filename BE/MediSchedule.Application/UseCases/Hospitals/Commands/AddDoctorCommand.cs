using MediatR;

namespace MediSchedule.Application.UseCases.Hospitals.Commands;

public record AddDoctorCommand(
    Guid HospitalId,
    List<Guid> DoctorIds
    ) : IRequest<IEnumerable<Guid>>;