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
public class MarmitasController : ControllerBase
{
    private readonly IMarmitaRepository _repository;
    private readonly IImageService _imageService;

    public MarmitasController(IMarmitaRepository repository, IImageService imageService)
    {
        _repository = repository;
        _imageService = imageService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ResponseMarmitaDto>>> GetAll()
    {
        var marmitas = await _repository.GetAllAsync();
        return Ok(marmitas.Adapt<IEnumerable<ResponseMarmitaDto>>());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ResponseMarmitaDto>> GetById(int id)
    {
        var marmita = await _repository.GetByIdAsync(id);
        if (marmita == null) return NotFound();
        return Ok(marmita.Adapt<ResponseMarmitaDto>());
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ResponseMarmitaDto>> Create(CreateMarmitaDto dto)
    {
        var marmita = dto.Adapt<Marmita>();
        await _repository.AddAsync(marmita);
        return CreatedAtAction(nameof(GetById), new { id = marmita.Id }, marmita.Adapt<ResponseMarmitaDto>());
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, CreateMarmitaDto dto)
    {
        var marmita = await _repository.GetByIdAsync(id);
        if (marmita == null) return NotFound();

        dto.Adapt(marmita);
        await _repository.UpdateAsync(marmita);
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var marmita = await _repository.GetByIdAsync(id);
        if (marmita == null) return NotFound();

        await _repository.DeleteAsync(id);
        return NoContent();
    }

    [HttpPost("upload")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UploadImage(IFormFile file)
    {
        try
        {
            var imageUrl = await _imageService.UploadImageAsync(file, Request.Scheme, Request.Host.Value, Request.PathBase.Value);
            return Ok(new { imageUrl });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
