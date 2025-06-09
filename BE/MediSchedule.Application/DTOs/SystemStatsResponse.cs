namespace MediSchedule.Application.DTOs;

public record SystemStatsResponse(
    double CpuPercent,
    string CpuStatus,
    
    double DiskPercent,
    string DiskStatus,
    
    double NetworkMbps,
    string NetworkStatus
    );