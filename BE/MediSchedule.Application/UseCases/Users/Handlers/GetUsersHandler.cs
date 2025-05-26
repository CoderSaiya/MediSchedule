using MediatR;
using MediSchedule.Application.UseCases.Users.Queries;
using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Application.UseCases.Users.Handlers;

public class GetUsersHandler(IUserRepository userRepository) : IRequestHandler<GetUsersQuery, IEnumerable<User>>
{
    public async Task<IEnumerable<User>> Handle(GetUsersQuery request, CancellationToken cancellationToken) =>
        await userRepository.ListAsync(request.Filer);
}