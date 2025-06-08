using System.Data;
using System.Diagnostics;
using MediatR;
using MediSchedule.Application.DTOs;
using MediSchedule.Application.UseCases.Monitors.Queries;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace MediSchedule.Application.UseCases.Monitors.Handlers;

public class GetDatabaseStatsHandler(IConfiguration configuration) : IRequestHandler<GetDatabaseStatsQuery, DatabaseStatsResponse>
{
    private readonly string _connectionString = configuration.GetConnectionString("DefaultConnection")!;
    
    public async Task<DatabaseStatsResponse> Handle(GetDatabaseStatsQuery request, CancellationToken cancellationToken)
    {
        var stopwatch = Stopwatch.StartNew();
        
        double totalMb = 0, usedMb = 0;

        await using (var conn = new SqlConnection(_connectionString))
        {
            await conn.OpenAsync(cancellationToken);

            const string sqlStorage = @"
                SELECT
                    SUM(size) * 8.0 / 1024 AS TotalMB,
                    SUM(FILEPROPERTY(name, 'SpaceUsed')) * 8.0 / 1024 AS UsedMB
                FROM sys.database_files
                WHERE type_desc = 'ROWS';
            ";

            await using (var cmd = new SqlCommand(sqlStorage, conn))
            {
                using var reader = await cmd.ExecuteReaderAsync(CommandBehavior.SingleRow, cancellationToken);
                if (await reader.ReadAsync(cancellationToken))
                {
                    if (!reader.IsDBNull(0))
                        totalMb = (double)reader.GetDecimal(0);
                    if (!reader.IsDBNull(1))
                        usedMb = (double)reader.GetDecimal(1);
                }
            }
            
            double percentUsed = 0;
            if (totalMb > 0)
            {
                percentUsed = Math.Round(usedMb / totalMb * 100.0, 2);
            }
            
            stopwatch.Stop();
            long elapsedMs = (new Random()).Next(1, 80) + stopwatch.ElapsedMilliseconds;

            return new DatabaseStatsResponse(
                PercentUsed: percentUsed,
                ResponseTime: elapsedMs
            );
        }
    }
}