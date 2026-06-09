using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class Marmita
{
    [Key]
    public int Id { get; set; }
    
    [Required(ErrorMessage = "O nome da marmita é obrigatório!")]
    [StringLength(100)]
    public string Nome { get; set; } = string.Empty;
    
    public string Descricao { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "O preço é obrigatório!")]
    public decimal Preco { get; set; }
    
    public string ImageUrl { get; set; } = string.Empty;

    public bool Ativo { get; set; } = true;
}
