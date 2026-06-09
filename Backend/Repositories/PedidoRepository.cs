using Backend.Data;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

public class PedidoRepository : IPedidoRepository
{
    private readonly AppContextDb _context;

    public PedidoRepository(AppContextDb context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Pedido>> GetAllAsync()
    {
        return await _context.Pedidos
            .Include(p => p.Usuario)
            .Include(p => p.Items)
                .ThenInclude(i => i.Marmita)
            .ToListAsync();
    }

    public async Task<IEnumerable<Pedido>> GetByUsuarioIdAsync(int usuarioId)
    {
        return await _context.Pedidos
            .Where(p => p.UsuarioId == usuarioId)
            .Include(p => p.Items)
                .ThenInclude(i => i.Marmita)
            .ToListAsync();
    }

    public async Task<Pedido?> GetByIdAsync(int id)
    {
        return await _context.Pedidos
            .Include(p => p.Usuario)
            .Include(p => p.Items)
                .ThenInclude(i => i.Marmita)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task AddAsync(Pedido pedido)
    {
        await _context.Pedidos.AddAsync(pedido);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateStatusAsync(int pedidoId, OrderStatus status)
    {
        var pedido = await _context.Pedidos.FindAsync(pedidoId);
        if (pedido != null)
        {
            pedido.Status = status;
            await _context.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<Pedido>> GetByPeriodAsync(DateTime start, DateTime end)
    {
        return await _context.Pedidos
            .Where(p => p.Timestamp >= start && p.Timestamp <= end)
            .Include(p => p.Items)
            .ToListAsync();
    }
}
