using MediatR;
using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Specifications;

namespace MediSchedule.Application.UseCases.Users.Queries;

public record GetUsersQuery(UserFiler Filer) : IRequest<IEnumerable<User>>;