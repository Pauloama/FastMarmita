using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class Usuario
{
    [Key]
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public string Nome { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string SenhaHash { get; set; } = string.Empty;

    public string Telefone { get; set; } = string.Empty;

    public string Endereco { get; set; } = string.Empty;

    public bool IsAdmin { get; set; } = false;
}
