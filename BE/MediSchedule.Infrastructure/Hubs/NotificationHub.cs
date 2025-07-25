﻿using System.Collections.Concurrent;
using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;
using MediSchedule.Domain.ValueObjects;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace MediSchedule.Infrastructure.Hubs;

// [Authorize]
public class NotificationHub(
    INotificationRepository notificationRepository,
    IUnitOfWork unitOfWork
    ) : Hub
{
    private static readonly ConcurrentDictionary<Guid, string> OnlineDoctors = new();
    public override async Task OnConnectedAsync()
    {
        var httpContext = Context.GetHttpContext();
        if (httpContext != null)
        {
            Console.WriteLine($"[NotificationHub] OnConnectedAsync called. QueryString = {httpContext.Request.QueryString}");
            
            if (httpContext.Request.Query.TryGetValue("doctorId", out var docIdString) &&
                Guid.TryParse(docIdString, out var docId))
            {
                OnlineDoctors[docId] = Context.ConnectionId;
                await Groups.AddToGroupAsync(Context.ConnectionId, GetGroupName(docId));
                await base.OnConnectedAsync();
                return;
            }
            
            if (httpContext.Request.Query.TryGetValue("sessionId", out var sessionIdStr) &&
                Guid.TryParse(sessionIdStr, out var sessionId))
            {
                var groupName = GetSessionGroupName(sessionId);
                await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
                await base.OnConnectedAsync();
                return;
            }
        }

        await base.OnConnectedAsync();
    }
    
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var httpContext = Context.GetHttpContext();
        Console.WriteLine($"[NotificationHub] OnDisconnectedAsync called. Exception: {exception}");
        
        if (httpContext != null &&
            httpContext.Request.Query.TryGetValue("doctorId", out var docIdString) &&
            Guid.TryParse(docIdString, out var docId))
        {
            OnlineDoctors.TryRemove(docId, out _);
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, GetGroupName(docId));
            await base.OnDisconnectedAsync(exception);
            return;
        }
        
        if (httpContext != null &&
            httpContext.Request.Query.TryGetValue("sessionId", out var sessionIdStr) &&
            Guid.TryParse(sessionIdStr, out var sessionId))
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, GetSessionGroupName(sessionId));
            await base.OnDisconnectedAsync(exception);
            return;
        }
        
        await base.OnDisconnectedAsync(exception);
    }

    [HubMethodName("SendNotificationAsync")]
    public async Task SendNotificationAsync(List<Guid> sessionIds, string type, string content)
    {
        if (!Enum.TryParse<NotificationType>(type, ignoreCase: true, out var notifType))
        {
            throw new HubException($"Loại thông báo không hợp lệ: {type}");
        }
        
        var timestamp = DateTime.UtcNow;
        foreach (var sessionId in sessionIds)
        {
            var groupName = GetSessionGroupName(sessionId);
            await Clients.Group(groupName).SendAsync("ReceiveNotification", new {
                Content = content,
                FromConnectionId = Context.ConnectionId,
                Timestamp = DateTime.UtcNow
            });
            
            var notification = new Notification {
                UserId = sessionId,
                Content = content,
                Type = notifType,
                CreatedAt = timestamp
            };
            await notificationRepository.AddAsync(notification);
        }
        await unitOfWork.CommitAsync();
    }
    
    public static string GetGroupName(Guid userId) => $"user-{userId}";
    public static string GetSessionGroupName(Guid sessionId) => $"session-{sessionId}";
}