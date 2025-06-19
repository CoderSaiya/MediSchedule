using MediatR;
using MediSchedule.Application.DTOs;

namespace MediSchedule.Application.UseCases.Monitors.Queries;

public record GetSystemStatsQuery() : IRequest<SystemStatsResponse>;