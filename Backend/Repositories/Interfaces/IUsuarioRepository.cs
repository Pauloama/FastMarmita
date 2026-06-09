using Backend.Models;

namespace Backend.Repositories.Interfaces;

public interface IUsuarioRepository
{
    Task<Usuario?> GetByEmailAsync(string email);
    Task AddAsync(Usuario usuario);
    Task<bool> ExistsByEmailAsync(string email);
}
