using Backend.Data;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

public class MarmitaRepository : IMarmitaRepository
{
    private readonly AppContextDb _context;

    public MarmitaRepository(AppContextDb context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Marmita>> GetAllAsync()
    {
        return await _context.Marmitas.Where(m => m.Ativo).ToListAsync();
    }

    public async Task<Marmita?> GetByIdAsync(int id)
    {
        return await _context.Marmitas.FirstOrDefaultAsync(m => m.Id == id && m.Ativo);
    }

    public async Task AddAsync(Marmita marmita)
    {
        marmita.Ativo = true;
        await _context.Marmitas.AddAsync(marmita);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Marmita marmita)
    {
        _context.Marmitas.Update(marmita);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var marmita = await _context.Marmitas.FindAsync(id);
        if (marmita != null)
        {
            marmita.Ativo = false;
            _context.Marmitas.Update(marmita);
            await _context.SaveChangesAsync();
        }
    }
}
