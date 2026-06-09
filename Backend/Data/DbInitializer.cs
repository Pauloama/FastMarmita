using Backend.Models;

namespace Backend.Data;

public static class DbInitializer
{
    public static void Initialize(AppContextDb context)
    {
        context.Database.EnsureCreated();

        if (!context.Marmitas.Any())
        {
            var marmitas = new Marmita[]
            {
                new Marmita { Nome = "Marmita de Frango Grelhado", Descricao = "Frango grelhado, arroz integral, feijão e legumes", Preco = 22.00m, ImageUrl = "", Ativo = true },
                new Marmita { Nome = "Feijoada Completa", Descricao = "Feijoada, arroz branco, couve, farofa e laranja", Preco = 28.50m, ImageUrl = "", Ativo = true },
                new Marmita { Nome = "Lasanha à Bolonhesa", Descricao = "Lasanha com molho bolonhesa e muito queijo", Preco = 25.00m, ImageUrl = "", Ativo = true }
            };

            context.Marmitas.AddRange(marmitas);
            context.SaveChanges();
        }

        if (!context.Usuarios.Any())
        {
            var admin = new Usuario
            {
                Nome = "Admin",
                Email = "admin@fastmarmita.com",
                SenhaHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                IsAdmin = true
            };
            context.Usuarios.Add(admin);
            context.SaveChanges();

            // Adicionar pedidos de exemplo para o admin apenas se não houver pedidos
            if (!context.Pedidos.Any())
            {
                var sampleMarmita = context.Marmitas.First();
                
                var pedido1 = new Pedido
                {
                    UsuarioId = admin.Id,
                    Status = OrderStatus.Entregue,
                    PrecoTotal = sampleMarmita.Preco,
                    MetodoPagamento = PaymentMethod.Pix,
                    Timestamp = DateTime.UtcNow.AddDays(-1),
                    Items = new List<OrderItem>
                    {
                        new OrderItem { MarmitaId = sampleMarmita.Id, Quantidade = 1, PrecoUnitario = sampleMarmita.Preco }
                    }
                };

                context.Pedidos.Add(pedido1);
                context.SaveChanges();
            }
        }
    }
}
