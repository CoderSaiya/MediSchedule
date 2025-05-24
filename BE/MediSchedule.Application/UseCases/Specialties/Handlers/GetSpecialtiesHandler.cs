using MediatR;
using MediSchedule.Application.UseCases.Specialties.Queries;
using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Application.UseCases.Specialties.Handlers;

public class GetSpecialtiesHandler(ISpecialtyRepository specialtyRepository) : IRequestHandler<GetSpecialtiesQuery, IEnumerable<Specialty>>
{
    public async Task<IEnumerable<Specialty>> Handle(GetSpecialtiesQuery request, CancellationToken cancellationToken)
        => await specialtyRepository.ListAsync(request.Filter);
}