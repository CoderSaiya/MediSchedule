using MediatR;
using MediSchedule.Domain.Specifications;

namespace MediSchedule.Application.UseCases.Statistics.Queries;

public record GetAdminStatisticsQuery() : IRequest<AdminStatistics>;