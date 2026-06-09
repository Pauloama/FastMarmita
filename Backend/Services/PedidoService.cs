using Backend.DTOs;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Mapster;

namespace Backend.Services;

public class PedidoService : Interfaces.IPedidoService
{
    private readonly IPedidoRepository _pedidoRepository;
    private readonly IMarmitaRepository _marmitaRepository;

    public PedidoService(IPedidoRepository pedidoRepository, IMarmitaRepository marmitaRepository)
    {
        _pedidoRepository = pedidoRepository;
        _marmitaRepository = marmitaRepository;
    }

    public async Task<ResponsePedidoDto?> CreatePedidoAsync(CreatePedidoDto dto, int userId)
    {
        if (dto.Items == null || !dto.Items.Any())
            return null;

        var pedido = new Pedido
        {
            UsuarioId = userId,
            MetodoPagamento = dto.MetodoPagamento,
            Observacoes = dto.Observacoes,
            Timestamp = DateTime.UtcNow,
            Status = OrderStatus.AguardandoAceite
        };

        decimal total = 0;
        foreach (var itemDto in dto.Items)
        {
            var marmita = await _marmitaRepository.GetByIdAsync(itemDto.MarmitaId);
            if (marmita == null) throw new Exception($"Marmita {itemDto.MarmitaId} não encontrada.");

            var item = new OrderItem
            {
                MarmitaId = marmita.Id,
                Quantidade = itemDto.Quantidade,
                PrecoUnitario = marmita.Preco
            };
            pedido.Items.Add(item);
            total += item.PrecoUnitario * item.Quantidade;
        }

        pedido.PrecoTotal = total;
        await _pedidoRepository.AddAsync(pedido);

        var result = await _pedidoRepository.GetByIdAsync(pedido.Id);
        return result.Adapt<ResponsePedidoDto>();
    }
}
