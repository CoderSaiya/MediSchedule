using MediatR;
using MediSchedule.Application.DTOs;
using MediSchedule.Application.UseCases.Prescriptions.Commands;
using MediSchedule.Application.UseCases.Storages.Commands;
using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;
using MediSchedule.Domain.ValueObjects;

namespace MediSchedule.Application.UseCases.Prescriptions.Handlers;

public class CreatePrescriptionHandler(
    IPrescriptionRepository prescriptionRepository,
    IAppointmentRepository appointmentRepository,
    IMedicineRepository medicineRepository,
    IMediator mediator,
    IUnitOfWork unitOfWork
    ): IRequestHandler<CreatePrescriptionCommand, PrescriptionResponse>
{
    public async Task<PrescriptionResponse> Handle(CreatePrescriptionCommand request, CancellationToken cancellationToken)
    {
        if (request == null) throw new ArgumentNullException(nameof(request));
        
        var appointmentExists = await appointmentRepository.GetByIdAsync(request.AppointmentId);
        if (appointmentExists is null)
            throw new KeyNotFoundException($"Không tìm thấy Appointment có Id = {request.AppointmentId}");
        
        var existing = await prescriptionRepository.GetByAppointmentIdAsync(request.AppointmentId);
        if (existing != null)
            throw new InvalidOperationException($"Appointment này đã có đơn thuốc (PrescriptionId = {existing.Id}).");
        
        var duplicateIds = request.Items
            .GroupBy(x => x.MedicineId)
            .Where(g => g.Count() > 1)
            .Select(g => g.Key)
            .ToList();
        if (duplicateIds.Any())
            throw new InvalidOperationException($"Không được lặp MedicineId: {string.Join(", ", duplicateIds.ToArray())}");
        
        var prescription = new Prescription
        {
            AppointmentId = request.AppointmentId,
            Notes = request.Notes?.Trim(),
            FileUrl = await mediator.Send(
                new StorageToBlobCommand(AppointmentId: Guid.Empty, ContainerName: "prescriptions", File: request.File), cancellationToken),
        };
        
        var tempMedicationTuples = new List<(PrescriptionMedication pm, Medicine medicineEntity)>();
        
        foreach (var itemDto in request.Items)
        {
            var medicineEntity = await medicineRepository.GetByIdAsync(itemDto.MedicineId);
            if (medicineEntity is null)
                throw new KeyNotFoundException($"MedicineId {itemDto.MedicineId} không tồn tại.");

            var pm = new PrescriptionMedication
            {
                MedicineId = medicineEntity.Id,
                Medicine = medicineEntity,
                Dosage = itemDto.Dosage.Trim(),
                Quantity = itemDto.Quantity,
                Unit = itemDto.Unit?.Trim(),
                Instructions = itemDto.Instructions.Trim(),
                ItemNotes = itemDto.ItemNotes?.Trim()
            };
            prescription.PrescriptionMedications.Add(pm);
            
            tempMedicationTuples.Add((pm, medicineEntity));
        }

        appointmentExists.Status = AppointmentStatus.Completed;
        
        await prescriptionRepository.AddAsync(prescription);
        await unitOfWork.CommitAsync();
        
        var itemsDto = tempMedicationTuples.Select(tuple => new PrescriptionMedicationDto(
            Id: tuple.pm.Id,
            MedicineId: tuple.pm.MedicineId,
            Dosage: tuple.pm.Dosage,
            Quantity: tuple.pm.Quantity,
            Unit: tuple.pm.Unit,
            Instructions: tuple.pm.Instructions,
            ItemNotes: tuple.pm.ItemNotes,
            Medicine: new MedicineDto(
                Id: tuple.medicineEntity.Id,
                Name: tuple.medicineEntity.Name,
                GenericName: tuple.medicineEntity.GenericName,
                Strength: tuple.medicineEntity.Strength,
                Manufacturer: tuple.medicineEntity.Manufacturer,
                Description: tuple.medicineEntity.Description
            )
        )).ToList();
        
        var resultDto = new PrescriptionResponse(
            Id: prescription.Id,
            AppointmentId: prescription.AppointmentId,
            Notes: prescription.Notes,
            FileUrl: prescription.FileUrl,
            Items: itemsDto
        );
        
        return resultDto;
    }
}