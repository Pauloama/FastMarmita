namespace Backend.Services;

public class ImageService : Interfaces.IImageService
{
    public async Task<string> UploadImageAsync(IFormFile file, string scheme, string host, string pathBase)
    {
        if (file == null || file.Length == 0)
            throw new ArgumentException("Nenhum arquivo enviado.");

        var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
        
        if (!Directory.Exists(uploadsPath))
        {
            Directory.CreateDirectory(uploadsPath);
        }

        var extension = Path.GetExtension(file.FileName);
        if (string.IsNullOrEmpty(extension))
        {
            extension = ".jpg"; 
        }
        
        var fileName = $"{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(uploadsPath, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var baseUrl = $"{scheme}://{host}{pathBase}";
        return $"{baseUrl}/uploads/{fileName}";
    }
}
