using Backend.DTOs;

namespace Backend.Services.Interfaces;

public interface IAuthService
{
    Task<UserResponseDto?> LoginAsync(LoginDto dto);
    Task<UserResponseDto?> RegisterAsync(RegisterDto dto);
}
