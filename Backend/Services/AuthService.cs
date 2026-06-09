using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Backend.DTOs;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Microsoft.IdentityModel.Tokens;

namespace Backend.Services;

public class AuthService : Interfaces.IAuthService
{
    private readonly IUsuarioRepository _usuarioRepository;
    private readonly IConfiguration _configuration;

    public AuthService(IUsuarioRepository usuarioRepository, IConfiguration configuration)
    {
        _usuarioRepository = usuarioRepository;
        _configuration = configuration;
    }

    public async Task<UserResponseDto?> LoginAsync(LoginDto dto)
    {
        var user = await _usuarioRepository.GetByEmailAsync(dto.Email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Senha, user.SenhaHash))
        {
            return null;
        }

        var token = GenerateJwtToken(user);

        return new UserResponseDto
        {
            Id = user.Id,
            Nome = user.Nome,
            Email = user.Email,
            Telefone = user.Telefone,
            Endereco = user.Endereco,
            Token = token,
            IsAdmin = user.IsAdmin
        };
    }

    public async Task<UserResponseDto?> RegisterAsync(RegisterDto dto)
    {
        if (await _usuarioRepository.ExistsByEmailAsync(dto.Email))
        {
            return null;
        }

        var user = new Usuario
        {
            Nome = dto.Nome,
            Email = dto.Email,
            SenhaHash = BCrypt.Net.BCrypt.HashPassword(dto.Senha),
            Telefone = dto.Telefone,
            Endereco = dto.Endereco,
            IsAdmin = false
        };

        await _usuarioRepository.AddAsync(user);

        var token = GenerateJwtToken(user);

        return new UserResponseDto
        {
            Id = user.Id,
            Nome = user.Nome,
            Email = user.Email,
            Telefone = user.Telefone,
            Endereco = user.Endereco,
            Token = token,
            IsAdmin = user.IsAdmin
        };
    }

    private string GenerateJwtToken(Usuario user)
    {
        var jwtSettings = _configuration.GetSection("Jwt");
        var key = Encoding.ASCII.GetBytes(jwtSettings["Key"]!);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Nome),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.IsAdmin ? "Admin" : "User")
            }),
            Expires = DateTime.UtcNow.AddDays(7),
            Issuer = jwtSettings["Issuer"],
            Audience = jwtSettings["Audience"],
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }
}
