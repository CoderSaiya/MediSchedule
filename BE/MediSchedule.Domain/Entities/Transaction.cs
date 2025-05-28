using MediSchedule.Domain.Common;
using TransactionStatus = MediSchedule.Domain.ValueObjects.TransactionStatus;

namespace MediSchedule.Domain.Entities;

public class Transaction : BaseEntity
{
    public string OrderId { get; set; }
    public string PartnerCode { get; set; }
    public string RequestId { get; set; }
    public long Amount { get; set; }
    public string OrderInfo { get; set; }
    public string PayUrl { get; set; }
    public TransactionStatus Status { get; set; }
    public int ResultCode { get; set; }
    public string? TransId { get; set; }
    public string? Message { get; set; }
    public string? PayType { get; set; }
    public DateTime? TransTime { get; set; }
    public string? ExtraData { get; set; }
    public string? Signature { get; set; }
}