using MediSchedule.Application.Interface;
using MediSchedule.Infrastructure.Hubs;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers;

[ApiController]
[Route("api/chat")]
public class ChatController(IChatService chatService) : Controller
{
    [HttpPost("create-ai-session")]
    public IActionResult CreateAiSession()
    {
        var sessionId = Guid.NewGuid();
        return Ok(new { sessionId = sessionId });
    }
    
    [HttpPost("assign-doctor")]
    public async Task<IActionResult> AssignDoctor()
    {
        // Nếu không có bác sĩ online:
        if (!ChatHub.OnlineDoctors.Any())
        {
            return BadRequest(new { error = "Không có bác sĩ trực tuyến." });
        }

        // Lấy random một bác sĩ:
        var rnd = new Random();
        var list = ChatHub.OnlineDoctors.ToList();
        var chosen = list[rnd.Next(list.Count)];
        var doctorId = chosen.Key;
        var doctorConnectionId = chosen.Value;

        // Tạo sessionId mới
        var sessionId = Guid.NewGuid();

        // Cho doctor join vào group "chat-session-{sessionId}"
        var groupName = ChatHub.GetSessionGroupName(sessionId);
        await chatService.AddConnectionToGroupAsync(doctorConnectionId, groupName);

        // Gửi event cho client: Bác sĩ đã sẵn sàng
        await chatService.SendSessionEventAsync(sessionId, new
        {
            type = "DoctorJoined",
            doctorName = $"BS. {doctorId.ToString().Substring(0, 8)}" // ví dụ lấy 8 ký tự đầu guid
        });

        return Ok(new { sessionId = sessionId });
    }
}