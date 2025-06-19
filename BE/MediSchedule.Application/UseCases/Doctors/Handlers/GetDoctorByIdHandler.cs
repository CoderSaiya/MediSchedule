using MediatR;
using MediSchedule.Application.UseCases.Doctors.Queries;
using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Application.UseCases.Doctors.Handlers;

public class GetDoctorByIdHandler(IDoctorRepository doctorRepository) : IRequestHandler<GetDoctorByIdQuery, Doctor?>
{
    public Task<Doctor?> Handle(GetDoctorByIdQuery request, CancellationToken cancellationToken)
        => doctorRepository.GetByIdAsync(request.Id);
}