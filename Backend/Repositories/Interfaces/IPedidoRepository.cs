using Backend.Models;

namespace Backend.Repositories.Interfaces;

public interface IPedidoRepository
{
    Task<IEnumerable<Pedido>> GetAllAsync();
    Task<IEnumerable<Pedido>> GetByUsuarioIdAsync(int usuarioId);
    Task<Pedido?> GetByIdAsync(int id);
    Task AddAsync(Pedido pedido);
    Task UpdateStatusAsync(int pedidoId, OrderStatus status);
    Task<IEnumerable<Pedido>> GetByPeriodAsync(DateTime start, DateTime end);
}
