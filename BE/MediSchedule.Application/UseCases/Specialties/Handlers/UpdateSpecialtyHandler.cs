using MediatR;
using MediSchedule.Application.UseCases.Specialties.Command;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Application.UseCases.Specialties.Handlers;

public class UpdateSpecialtyHandler(
    ISpecialtyRepository specialtyRepository,
    IUnitOfWork unitOfWork
    ) : IRequestHandler<UpdateSpecialtyCommand, Unit>
{
    public async Task<Unit> Handle(UpdateSpecialtyCommand request, CancellationToken cancellationToken)
    {
        await specialtyRepository.UpdateAsync(request.Specialty);
        
        await unitOfWork.CommitAsync();
        
        return Unit.Value;
    }
}