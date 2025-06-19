using MediatR;
using MediSchedule.Application.UseCases.Medicines.Commands;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Application.UseCases.Medicines.Handlers;

public class CreateMedicineHandler(
    IMedicineRepository medicineRepository,
    IUnitOfWork unitOfWork
    ) : IRequestHandler<CreateMedicineCommand, Unit>
{
    public async Task<Unit> Handle(CreateMedicineCommand request, CancellationToken cancellationToken)
    {
        await medicineRepository.AddAsync(request.Medicine);

        await unitOfWork.CommitAsync();
        
        return Unit.Value;
    }
}