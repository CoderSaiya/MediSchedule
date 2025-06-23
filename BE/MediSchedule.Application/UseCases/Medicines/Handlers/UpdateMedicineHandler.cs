using MediatR;
using MediSchedule.Application.UseCases.Medicines.Commands;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Application.UseCases.Medicines.Handlers;

public class UpdateMedicineHandler(
    IMedicineRepository medicineRepository,
    IUnitOfWork unitOfWork
    ) : IRequestHandler<UpdateMedicineCommand, Unit>
{
    public async Task<Unit> Handle(UpdateMedicineCommand request, CancellationToken cancellationToken)
    {
        var medicine = await medicineRepository.GetByIdAsync(request.Id);
        if (medicine is null)
            throw new Exception($"Medicine with ID {request.Id} not found.");
        
        if (string.IsNullOrWhiteSpace(request.Name))
            throw new Exception("Medicine name cannot be empty.");
        medicine.Name = request.Name.Trim();
        
        medicine.GenericName = string.IsNullOrWhiteSpace(request.GenericName) ? medicine.GenericName : request.GenericName.Trim();
        medicine.Strength = string.IsNullOrWhiteSpace(request.Strength) ? medicine.Strength : request.Strength.Trim();
        medicine.Manufacturer = string.IsNullOrWhiteSpace(request.Manufacturer) ? medicine.Manufacturer : request.Manufacturer.Trim();
        medicine.Description = string.IsNullOrWhiteSpace(request.Description) ? medicine.Description : request.Description.Trim();
        
        await medicineRepository.UpdateAsync(medicine);
        
        await unitOfWork.CommitAsync();
        
        return Unit.Value;
    }
}