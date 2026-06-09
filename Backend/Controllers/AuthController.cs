using Backend.DTOs;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserResponseDto>> Login(LoginDto dto)
    {
        var result = await _authService.LoginAsync(dto);
        if (result == null)
        {
            return Unauthorized("Email ou senha inválidos.");
        }

        return Ok(result);
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserResponseDto>> Register(RegisterDto dto)
    {
        var result = await _authService.RegisterAsync(dto);
        if (result == null)
        {
            return BadRequest("Email já cadastrado.");
        }

        return Ok(result);
    }
}
