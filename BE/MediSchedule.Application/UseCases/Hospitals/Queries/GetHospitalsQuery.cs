using MediatR;
using MediSchedule.Application.DTOs;

namespace MediSchedule.Application.UseCases.Hospitals.Queries;

public record GetHospitalsQuery() : IRequest<IEnumerable<HospitalResponse>>;