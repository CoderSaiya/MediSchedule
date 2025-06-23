using MediatR;
using MediSchedule.Application.UseCases.Medicines.Commands;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Application.UseCases.Medicines.Handlers;

public class DeleteMedicineHandler(
    IMedicineRepository medicineRepository,
    IUnitOfWork unitOfWork
) : IRequestHandler<DeleteMedicineCommand, Unit>
{
    public async Task<Unit> Handle(DeleteMedicineCommand request, CancellationToken cancellationToken)
    {
        var medicine = await medicineRepository.GetByIdAsync(request.MedicineId);
        if (medicine is null)
            throw new Exception($"Medicine with ID {request.MedicineId} not found.");
        
        await medicineRepository.DeleteAsync(medicine.Id);
        
        await unitOfWork.CommitAsync();
        
        return Unit.Value;
    }
}