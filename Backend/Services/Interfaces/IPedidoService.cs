using Backend.DTOs;

namespace Backend.Services.Interfaces;

public interface IPedidoService
{
    Task<ResponsePedidoDto?> CreatePedidoAsync(CreatePedidoDto dto, int userId);
}
