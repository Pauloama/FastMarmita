using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class OrderItem
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int PedidoId { get; set; }
    public Pedido? Pedido { get; set; }

    [Required]
    public int MarmitaId { get; set; }
    public Marmita? Marmita { get; set; }

    public int Quantidade { get; set; }

    public decimal PrecoUnitario { get; set; }
}
