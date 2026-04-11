using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PharmaCore.Core.DTOs.Drug;
using PharmaCore.Core.Interfaces.Services;

namespace PharmaCore.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DrugsController : ControllerBase
    {
        private readonly IDrugService _drugService;

        public DrugsController(IDrugService drugService)
        {
            _drugService = drugService;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<DrugResponseDto>>> GetAll()
        {
            var drugsDto = await _drugService.GetAllAsync();
            return Ok(drugsDto);
        }

        [HttpGet("{id:int}", Name= "GetDrugById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<DrugResponseDto>> GetById(int id)
        {
            var drugDto = await _drugService.GetByIdAsync(id);
            return Ok(drugDto);
        }

        [HttpGet("search")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<DrugResponseDto>>> Search([FromQuery] string term)
        {
            var drugsDto = await _drugService.SearchAsync(term);
            return Ok(drugsDto);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<DrugResponseDto>> Create([FromBody] CreateDrugDto createDto)
        {
            var drugDto = await _drugService.CreateAsync(createDto);
            return CreatedAtRoute("GetDrugById", new {id = drugDto.DrugId}, drugDto);
        }

        [HttpPut("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateDrugDto updateDto)
        {
            await _drugService.UpdateAsync(id, updateDto);
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [Authorize(Roles = "Admin,Pharmacist")]
        public async Task<IActionResult> Delete(int id)
        {
            await _drugService.DeleteAsync(id);
            return NoContent();
        }

        [HttpGet("exists/{tradeName}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<bool>> CheckName(string tradeName)
        {
            bool exists = await _drugService.IsTradeNameExistsAsync(tradeName);
            return Ok(exists);
        }
    }
}