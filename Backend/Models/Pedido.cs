using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public enum OrderStatus
{
    AguardandoAceite,
    EmPreparo,
    EmEntrega,
    Entregue,
    Cancelado
}

public enum PaymentMethod
{
    Cartao,
    Pix,
    Dinheiro
}

public class Pedido
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int UsuarioId { get; set; }
    public Usuario? Usuario { get; set; }

    public List<OrderItem> Items { get; set; } = new();

    public OrderStatus Status { get; set; } = OrderStatus.AguardandoAceite;

    public decimal PrecoTotal { get; set; }

    public PaymentMethod MetodoPagamento { get; set; }

    public string? Observacoes { get; set; }

    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
