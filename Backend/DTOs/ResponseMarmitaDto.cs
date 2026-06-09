namespace Backend.DTOs;

public class ResponseMarmitaDto
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Descricao { get; set; } = string.Empty;
    public decimal Preco { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
}
