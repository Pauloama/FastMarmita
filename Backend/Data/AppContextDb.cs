using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public class AppContextDb : DbContext
{
    public AppContextDb(DbContextOptions<AppContextDb> options) : base(options)
    {
    }

    public DbSet<Marmita> Marmitas { get; set; }
    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Pedido> Pedidos { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Marmita>()
            .Property(m => m.Preco)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<OrderItem>()
            .Property(oi => oi.PrecoUnitario)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<Pedido>()
            .Property(p => p.PrecoTotal)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<Pedido>()
            .HasOne(p => p.Usuario)
            .WithMany()
            .HasForeignKey(p => p.UsuarioId);

        modelBuilder.Entity<OrderItem>()
            .HasOne(oi => oi.Pedido)
            .WithMany(p => p.Items)
            .HasForeignKey(oi => oi.PedidoId);

        modelBuilder.Entity<OrderItem>()
            .HasOne(oi => oi.Marmita)
            .WithMany()
            .HasForeignKey(oi => oi.MarmitaId);
    }
}
