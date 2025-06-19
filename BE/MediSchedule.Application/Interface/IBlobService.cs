using Microsoft.AspNetCore.Http;

namespace MediSchedule.Application.Interface;

public interface IBlobService
{
    Task<string> UploadFileAsync(string containerName, IFormFile file);
    Task DeleteFileAsync(string fileUrl);
}