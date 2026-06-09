using Backend.Models;

namespace Backend.DTOs;

public class CreatePedidoDto
{
    public List<CreateOrderItemDto> Items { get; set; } = new();
    public PaymentMethod MetodoPagamento { get; set; }
    public string? Observacoes { get; set; }
}

public class CreateOrderItemDto
{
    public int MarmitaId { get; set; }
    public int Quantidade { get; set; }
}
