namespace MediSchedule.Domain.ValueObjects;

public enum TransactionStatus
{
    Pending = 0,
    Processing = 1,
    Success = 2,
    Failed = 3,
    Expired = 4,
    Cancelled = 5
}