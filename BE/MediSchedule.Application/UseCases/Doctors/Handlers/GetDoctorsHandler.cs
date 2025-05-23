using MediatR;
using MediSchedule.Application.UseCases.Doctors.Queries;
using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Application.UseCases.Doctors.Handlers;

public class GetDoctorsHandler(IDoctorRepository doctorRepository) : IRequestHandler<GetDoctorsQuery, IEnumerable<Doctor>>
{
    public Task<IEnumerable<Doctor>> Handle(GetDoctorsQuery request, CancellationToken cancellationToken)
        => doctorRepository.ListAsync(request.Filter);
}