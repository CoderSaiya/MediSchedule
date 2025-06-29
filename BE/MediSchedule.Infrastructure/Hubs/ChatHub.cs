using System.Collections.Concurrent;
using System.Net.Http.Json;
using MediSchedule.Domain.Common;
using Microsoft.AspNetCore.SignalR;

namespace MediSchedule.Infrastructure.Hubs;

public class ChatHub(IHttpClientFactory httpClientFactory) : Hub
{
    public static ConcurrentDictionary<Guid, string> OnlineDoctors { get; } = new();
    public override async Task OnConnectedAsync()
    {
        var httpContext = Context.GetHttpContext();
        if (httpContext != null)
        {
            Console.WriteLine($"[ChatHub] OnConnectedAsync called. QueryString = {httpContext.Request.QueryString}");
            
            if (httpContext.Request.Query.TryGetValue("doctorId", out var docIdString) &&
                Guid.TryParse(docIdString, out var docId))
            {
                OnlineDoctors[docId] = Context.ConnectionId;
                await base.OnConnectedAsync();
                return;
            }
            
            var sessionIdStr = httpContext.Request.Query["sessionId"].ToString();
            if (Guid.TryParse(sessionIdStr, out var sessionId))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, GetSessionGroupName(sessionId));
            }
        }

        await base.OnConnectedAsync();
    }
    
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var httpContext = Context.GetHttpContext();
        Console.WriteLine($"[ChatHub] OnDisconnectedAsync called. Exception: {exception}");
        
        if (httpContext != null &&
            httpContext.Request.Query.TryGetValue("doctorId", out var docIdString) &&
            Guid.TryParse(docIdString, out var docId))
        {
            OnlineDoctors.TryRemove(docId, out _);
            await base.OnDisconnectedAsync(exception);
            return;
        }
        
        var sessionIdStr = httpContext.Request.Query["sessionId"].ToString();
        if (Guid.TryParse(sessionIdStr, out var sessionId))
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, GetSessionGroupName(sessionId));
        }
        
        await base.OnDisconnectedAsync(exception);
    }
    
    [HubMethodName("SendMessageAsync")]
    public async Task SendMessageAsync(Guid sessionId, string senderType, string content)
    {
        var groupName = GetSessionGroupName(sessionId);
        Console.WriteLine($"[ChatHub] SendMessageAsync called. sessionId={sessionId}, senderType={senderType}, content={content}");
        
        try
        {
            // Phát tin của user ngay cho group
            var payloadUser = new
            {
                id = Guid.NewGuid(),
                sessionId,
                senderType,
                content,
                createdAt = DateTime.UtcNow
            };
            Console.WriteLine($"[ChatHub] Broadcasting user message to group '{groupName}'");
            await Clients.OthersInGroup(groupName).SendAsync("ReceiveMessage", payloadUser);

            // Nếu là user (AI mode), gọi Python
            if (senderType.Equals("User", StringComparison.OrdinalIgnoreCase))
            {
                Console.WriteLine("[ChatHub] Caller is User => preparing to call Python AI service");
                var client = httpClientFactory.CreateClient();
                var pythonUrl = "http://localhost:8000/chat"; 
                
                // Debug: kiểm tra Python URL trước khi call
                Console.WriteLine($"[ChatHub] Posting to Python URL: {pythonUrl} with payload message='{content}'");
                var requestPayload = new { message = content };

                HttpResponseMessage response = await client.PostAsJsonAsync(pythonUrl, requestPayload);
                Console.WriteLine($"[ChatHub] Python returned status code {response.StatusCode}");
                response.EnsureSuccessStatusCode();

                var aiResult = await response.Content.ReadFromJsonAsync<AiResponse>();
                if (aiResult == null)
                {
                    Console.WriteLine("[ChatHub] aiResult deserialized to null");
                    throw new InvalidOperationException("aiResult is null");
                }

                Console.WriteLine($"[ChatHub] aiResult: ${aiResult.Response}");
                string botContent = $"{aiResult.Response}";

                var payloadAi = new
                {
                    id = Guid.NewGuid(),
                    sessionId,
                    senderType = "Bot",
                    content = botContent,
                    createdAt = DateTime.UtcNow
                };

                Console.WriteLine($"[ChatHub] Broadcasting AI message to group '{groupName}': {botContent}");
                await Clients.Group(groupName).SendAsync("ReceiveMessage", payloadAi);
            }
        }
        catch (Exception ex)
        {
            // Print stack trace chi tiết ra console
            Console.Error.WriteLine($"[ChatHub] Exception in SendMessageAsync: {ex}");
            
            var errorPayload = new
            {
                id = Guid.NewGuid(),
                sessionId,
                senderType = "Bot",
                content = "Đã xảy ra lỗi nội bộ khi xử lý yêu cầu. Vui lòng thử lại sau.",
                createdAt = DateTime.UtcNow
            };
            await Clients.Group(groupName).SendAsync("ReceiveMessage", errorPayload);
        }
    }
    
    public static string GetSessionGroupName(Guid sessionId) => $"chat-session-{sessionId}";
}