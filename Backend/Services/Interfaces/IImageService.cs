namespace Backend.Services.Interfaces;

public interface IImageService
{
    Task<string> UploadImageAsync(IFormFile file, string scheme, string host, string pathBase);
}
