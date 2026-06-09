using Backend.Models;

namespace Backend.DTOs;

public class ResponsePedidoDto
{
    public int Id { get; set; }
    public int UsuarioId { get; set; }
    public string UsuarioNome { get; set; } = string.Empty;
    public List<ResponseOrderItemDto> Items { get; set; } = new();
    public OrderStatus Status { get; set; }
    public decimal PrecoTotal { get; set; }
    public PaymentMethod MetodoPagamento { get; set; }
    public string? Observacoes { get; set; }
    public DateTime Timestamp { get; set; }
}

public class ResponseOrderItemDto
{
    public int MarmitaId { get; set; }
    public string MarmitaNome { get; set; } = string.Empty;
    public int Quantidade { get; set; }
    public decimal PrecoUnitario { get; set; }
}
