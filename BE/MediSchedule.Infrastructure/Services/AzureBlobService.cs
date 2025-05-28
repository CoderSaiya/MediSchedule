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
    
    public async Task DeleteFileAsync(string fileUrl)
    {
        var uri = new Uri(fileUrl);
        var segments = uri.AbsolutePath.TrimStart('/').Split('/');
        if (segments.Length < 2)
            throw new ArgumentException("The file URL is invalid.");

        var containerName = segments[0];
        var blobName = string.Join('/', segments.Skip(1));

        var container = _blobClient.GetBlobContainerClient(containerName);
        var blobClient = container.GetBlobClient(blobName);

        await blobClient.DeleteIfExistsAsync();
    }
}