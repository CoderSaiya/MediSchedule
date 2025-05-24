using MediatR;
using MediSchedule.Application.UseCases.Specialties.Command;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Application.UseCases.Specialties.Handlers;

public class CreateSpecialtyHandler(
    ISpecialtyRepository specialtyRepository,
    IUnitOfWork unitOfWork
    ) : IRequestHandler<CreateSpecialtyCommand, Unit>
{
    public async Task<Unit> Handle(CreateSpecialtyCommand request, CancellationToken cancellationToken)
    {
        await specialtyRepository.AddAsync(request.Specialty);
        
        await unitOfWork.CommitAsync();
        
        return Unit.Value;
    }
}