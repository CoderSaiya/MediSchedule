using MediatR;
using MediSchedule.Application.DTOs;
using MediSchedule.Application.UseCases.Medicines.Queries;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Application.UseCases.Medicines.Handlers;

public class GetMedicinesHandler(IMedicineRepository medicineRepository) : IRequestHandler<GetMedicinesQuery, IEnumerable<MedicineResponse>>
{
    public async Task<IEnumerable<MedicineResponse>> Handle(GetMedicinesQuery request,
        CancellationToken cancellationToken) =>
        (await medicineRepository.ListAsync()).Select(m => new MedicineResponse(
            Id: m.Id,
            Name: m.Name,
            GenericName: m.GenericName,
            Strength: m.Strength,
            Manufacturer: m.Manufacturer,
            Description: m.Description
        ));
}