using Microsoft.AspNetCore.Mvc;
using PharmaCore.Core.DTOs.DrugAlternative;
using PharmaCore.Core.Interfaces.Services;

namespace PharmaCore.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DrugAlternativesController : ControllerBase
    {
        private readonly IDrugAlternativeService _drugAlternativeService;

        public DrugAlternativesController(IDrugAlternativeService drugAlternativeService)
        {
            _drugAlternativeService = drugAlternativeService;
        }

        [HttpGet("{drugId}")]
        [ProducesResponseType(typeof(DrugAlternativeResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<DrugAlternativeResponseDto>> GetAlternatives(int drugId)
        {
            var result = await _drugAlternativeService.GetAlternativesAsync(drugId);
            return Ok(result);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> AddAlternative([FromBody] CreateDrugAlternativeDto dto)
        {
            await _drugAlternativeService.AddAlternativeAsync(dto);
            return StatusCode(StatusCodes.Status201Created);
        }

        [HttpDelete("{id1}/{id2}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> RemoveAlternative(int id1, int id2)
        {
            await _drugAlternativeService.RemoveAlternativeAsync(id1, id2);
            return NoContent();
        }
    }
}