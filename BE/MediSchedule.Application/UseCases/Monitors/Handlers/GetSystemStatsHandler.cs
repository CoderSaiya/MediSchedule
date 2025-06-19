using MediatR;
using MediSchedule.Application.DTOs;
using MediSchedule.Application.UseCases.Monitors.Queries;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace MediSchedule.Application.UseCases.Monitors.Handlers
{
    public class GetSystemStatsHandler(IConfiguration configuration)
        : IRequestHandler<GetSystemStatsQuery, SystemStatsResponse>
    {
        private readonly string _connectionString = configuration.GetConnectionString("DefaultConnection")!;

        public async Task<SystemStatsResponse> Handle(
            GetSystemStatsQuery request, 
            CancellationToken cancellationToken
        )
        {
            double cpuPercent = 0, diskPercent = 0;
            long networkBytesPerSec = 0;

            // Lấy CPU % từ sys.dm_os_ring_buffers
            const string cpuSql = @"
                SELECT TOP 1
                    x.ring_xml.value('(/Record/SchedulerMonitorEvent/SystemHealth/ProcessUtilization)[1]', 'INT') AS ProcessCPUPercent,
                    x.ring_xml.value('(/Record/SchedulerMonitorEvent/SystemHealth/SystemIdle)[1]', 'INT') AS SystemIdlePercent,
                    100 
                      - x.ring_xml.value('(/Record/SchedulerMonitorEvent/SystemHealth/SystemIdle)[1]', 'INT') AS SystemCPUPercent
                FROM (
                    SELECT CONVERT(XML, record) AS ring_xml
                    FROM sys.dm_os_ring_buffers
                    WHERE ring_buffer_type = 'RING_BUFFER_SCHEDULER_MONITOR'
                      AND record LIKE '%<SystemHealth>%'
                ) AS x
                ORDER BY 
                    x.ring_xml.value('(/Record/@time)[1]', 'BIGINT') DESC;
                ";

            // Lấy Disk %
            const string diskSql = @"
                SELECT 
                    CAST(
                      (SUM(vs.total_bytes) - SUM(vs.available_bytes)) * 100.0 
                      / NULLIF(SUM(vs.total_bytes), 0)
                      AS FLOAT
                    ) AS DiskPercentUsed
                FROM sys.master_files AS f
                CROSS APPLY sys.dm_os_volume_stats(f.database_id, f.file_id) AS vs
                WHERE f.type_desc = 'ROWS';
            ";

            // Lấy Network I/O (nếu có counter, nếu không cần giải pháp ngoài SQL)
            const string networkSql = @"
                SELECT 
                    CAST(
                      (
                        SUM(
                          CASE 
                            WHEN counter_name = 'Bytes Received/sec' THEN cntr_value 
                            ELSE 0 
                          END
                        ) 
                        + SUM(
                            CASE 
                              WHEN counter_name = 'Bytes Sent/sec' THEN cntr_value 
                              ELSE 0 
                            END
                          )
                      ) AS BIGINT
                    ) AS BytesPerSec
                FROM sys.dm_os_performance_counters
                WHERE object_name LIKE 'SQLServer:Network Interface(%'
                  AND counter_name IN ('Bytes Received/sec','Bytes Sent/sec');
            ";

            await using var conn = new SqlConnection(_connectionString);
            await conn.OpenAsync(cancellationToken);
            
            await using (var cpuCmd = new SqlCommand(cpuSql, conn))
            {
                cpuCmd.CommandTimeout = 30;
                await using var reader = await cpuCmd.ExecuteReaderAsync(cancellationToken);
                if (await reader.ReadAsync(cancellationToken))
                {
                    if (!reader.IsDBNull(2))
                    {
                        cpuPercent = reader.GetInt32(2);
                        cpuPercent = Math.Clamp(cpuPercent, 0, 100);
                    }
                    else
                    {
                        cpuPercent = 0;
                    }
                }
            }
            
            await using (var diskCmd = new SqlCommand(diskSql, conn))
            {
                diskCmd.CommandTimeout = 30;
                var result = await diskCmd.ExecuteScalarAsync(cancellationToken);
                if (result != null && result != DBNull.Value)
                {
                    diskPercent = Convert.ToDouble(result);
                    diskPercent = Math.Clamp(diskPercent, 0, 100);
                }
            }
            
            await using (var netCmd = new SqlCommand(networkSql, conn))
            {
                netCmd.CommandTimeout = 30;
                var result = await netCmd.ExecuteScalarAsync(cancellationToken);
                if (result != null && result != DBNull.Value)
                {
                    networkBytesPerSec = Convert.ToInt64(result);
                }
            }
            
            double networkMbps = Math.Round(networkBytesPerSec / (1024.0 * 1024.0), 2);
            
            string cpuStatus = cpuPercent switch
            {
                <= 70.0 => "Tốt",
                <= 90.0 => "Cảnh báo",
                _ => "Quá tải"
            };

            string diskStatus = diskPercent switch
            {
                <= 70.0 => "Tốt",
                <= 90.0 => "Cảnh báo",
                _ => "Quá tải"
            };

            string networkStatus = networkMbps switch
            {
                <= 50.0 => "Tốt",
                <= 100.0 => "Cảnh báo",
                _ => "Quá tải"
            };

            return new SystemStatsResponse(
                CpuPercent: Math.Round(cpuPercent, 2),
                CpuStatus: cpuStatus,
                DiskPercent: Math.Round(diskPercent, 2),
                DiskStatus: diskStatus,
                NetworkMbps: networkMbps,
                NetworkStatus: networkStatus
            );
        }
    }
}