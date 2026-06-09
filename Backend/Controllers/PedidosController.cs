using System.Security.Claims;
using Backend.DTOs;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;
using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class PedidosController : ControllerBase
{
    private readonly IPedidoRepository _repository;
    private readonly IPedidoService _pedidoService;

    public PedidosController(IPedidoRepository repository, IPedidoService pedidoService)
    {
        _repository = repository;
        _pedidoService = pedidoService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ResponsePedidoDto>>> GetAll()
    {
        if (User.IsInRole("Admin"))
        {
            var pedidos = await _repository.GetAllAsync();
            return Ok(pedidos.Adapt<IEnumerable<ResponsePedidoDto>>());
        }
        
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return Unauthorized();

        var userId = int.Parse(userIdClaim.Value);
        var pedidosUsuario = await _repository.GetByUsuarioIdAsync(userId);
        return Ok(pedidosUsuario.Adapt<IEnumerable<ResponsePedidoDto>>());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ResponsePedidoDto>> GetById(int id)
    {
        var pedido = await _repository.GetByIdAsync(id);
        if (pedido == null) return NotFound();

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return Unauthorized();

        var userId = int.Parse(userIdClaim.Value);
        if (pedido.UsuarioId != userId && !User.IsInRole("Admin")) return Forbid();

        return Ok(pedido.Adapt<ResponsePedidoDto>());
    }

    [HttpPost]
    public async Task<ActionResult<ResponsePedidoDto>> Create(CreatePedidoDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return Unauthorized();

        var userId = int.Parse(userIdClaim.Value);
        
        try
        {
            var result = await _pedidoService.CreatePedidoAsync(dto, userId);
            if (result == null) return BadRequest("O pedido deve conter pelo menos uma marmita.");

            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPatch("{id}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] OrderStatus status)
    {
        await _repository.UpdateStatusAsync(id, status);
        return NoContent();
    }

    [HttpGet("report")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<SalesReportDto>> GetReport([FromQuery] DateTime start, [FromQuery] DateTime end)
    {
        var pedidos = await _repository.GetByPeriodAsync(start, end);
        var report = new SalesReportDto
        {
            TotalSales = pedidos.Sum(p => p.PrecoTotal),
            OrderCount = pedidos.Count(),
            StartDate = start,
            EndDate = end
        };
        return Ok(report);
    }
}
