using Backend.Models;

namespace Backend.Repositories.Interfaces;

public interface IMarmitaRepository
{
    Task<IEnumerable<Marmita>> GetAllAsync();
    Task<Marmita?> GetByIdAsync(int id);
    Task AddAsync(Marmita marmita);
    Task UpdateAsync(Marmita marmita);
    Task DeleteAsync(int id);
}
