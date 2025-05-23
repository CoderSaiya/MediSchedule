using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using MediSchedule.Application.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace MediSchedule.Infrastructure.Services;

public class AzureBlobService : IBlobService
{
    private readonly BlobServiceClient _blobClient;
    public AzureBlobService(IConfiguration config)
    {
        var conn = config.GetConnectionString("AzureBlobStorage");
        _blobClient = new BlobServiceClient(conn);
    }
    
    public async Task<string> UploadFileAsync(string containerName, IFormFile file)
    {
        // Tạo hoặc lấy container
        var container = _blobClient.GetBlobContainerClient(containerName);
        await container.CreateIfNotExistsAsync(PublicAccessType.Blob);

        // Đổi tên file để tránh trùng lặp
        var extension = Path.GetExtension(file.FileName);
        var blobName = $"{Guid.NewGuid()}{extension}";
        var blobClient = container.GetBlobClient(blobName);

        // Upload
        using var stream = file.OpenReadStream();
        await blobClient.UploadAsync(stream, new BlobHttpHeaders { ContentType = file.ContentType });
        
        return blobClient.Uri.ToString();
    }
}