using MediatR;
using MediSchedule.Application.DTOs;
using MediSchedule.Application.UseCases.Prescriptions.Commands;
using MediSchedule.Application.UseCases.Storages.Commands;
using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;

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
        
        bool appointmentExists = await appointmentRepository.ExistsAsync(a => a.Id == request.AppointmentId);
        if (!appointmentExists)
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
            Id = Guid.NewGuid(),
            AppointmentId = request.AppointmentId,
            Notes = request.Notes?.Trim(),
            FileUrl = await mediator.Send(
                new StorageToBlobCommand(AppointmentId: Guid.Empty, ContainerName: "prescriptions", File: request.File), cancellationToken),
        };
        
        foreach (var itemDto in request.Items)
        {
            bool medExists = await medicineRepository.ExistsAsync(m => m.Id == itemDto.MedicineId);
            if (!medExists)
                throw new KeyNotFoundException($"MedicineId {itemDto.MedicineId} không tồn tại.");

            var pm = new PrescriptionMedication
            {
                PrescriptionId = prescription.Id,
                MedicineId = itemDto.MedicineId,
                Dosage = itemDto.Dosage.Trim(),
                Quantity = itemDto.Quantity,
                Unit = itemDto.Unit?.Trim(),
                Instructions = itemDto.Instructions.Trim(),
                ItemNotes = itemDto.ItemNotes?.Trim()
            };
            prescription.PrescriptionMedications.Add(pm);
        }
        
        await prescriptionRepository.AddAsync(prescription);
        await unitOfWork.CommitAsync();
        
        var resultDto = new PrescriptionResponse
        (
            Id: prescription.Id,
            AppointmentId: prescription.AppointmentId,
            Notes: prescription.Notes,
            FileUrl: prescription.FileUrl,
            Items: new List<PrescriptionMedicationDto>()
        );
        
        foreach (var pm in prescription.PrescriptionMedications)
        {
            var med = pm.Medicine;
            var pmDto = new PrescriptionMedicationDto
            (
                Id: pm.Id,
                MedicineId: pm.MedicineId,
                Dosage: pm.Dosage,
                Quantity: pm.Quantity,
                Unit: pm.Unit,
                Instructions: pm.Instructions,
                ItemNotes: pm.ItemNotes,
                Medicine: new MedicineDto
                (
                    Id: med.Id,
                    Name: med.Name,
                    GenericName: med.GenericName,
                    Strength: med.Strength,
                    Manufacturer: med.Manufacturer,
                    Description: med.Description
                )
            );
            resultDto.Items.Add(pmDto);
        }
        
        return resultDto;
    }
}