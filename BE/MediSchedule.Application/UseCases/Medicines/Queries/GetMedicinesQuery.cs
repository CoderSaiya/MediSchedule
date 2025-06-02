using MediatR;
using MediSchedule.Application.DTOs;

namespace MediSchedule.Application.UseCases.Medicines.Queries;

public record GetMedicinesQuery() : IRequest<IEnumerable<MedicineResponse>>;