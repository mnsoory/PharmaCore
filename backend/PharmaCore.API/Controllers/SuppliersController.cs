using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PharmaCore.Core.DTOs.Supplier;
using PharmaCore.Core.Interfaces.Services;

namespace PharmaCore.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SuppliersController : ControllerBase
    {
        private readonly ISupplierService _supplierService;

        public SuppliersController(ISupplierService supplierService)
        {
            _supplierService = supplierService;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<SupplierResponseDto>>> GetAll()
        {
            var suppliersDto = await _supplierService.GetAllAsync();
            return Ok(suppliersDto);
        }

        [HttpGet("inactive")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<SupplierResponseDto>>> GetAllInActive()
        {
            var suppliersDto = await _supplierService.GetAllInActiveAsync();
            return Ok(suppliersDto);
        }

        [HttpGet("{id}", Name = "GetSupplierById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<SupplierResponseDto>> GetById(int id)
        {
            var supplierDto = await _supplierService.GetByIdAsync(id);
            return Ok(supplierDto);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<ActionResult<SupplierResponseDto>> Create(CreateSupplierDto createDto) 
        {
            var supplierDto = await _supplierService.CreateAsync(createDto);
            return CreatedAtRoute("GetSupplierById", new {id = supplierDto.SupplierId}, supplierDto); 
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Update(int id, UpdateSupplierDto updateDto)
        { 
            await _supplierService.UpdateAsync(id, updateDto);
            return NoContent(); 
        }

        [HttpPatch("{id}/status")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<bool>> ToggleStatusAsync(int id) 
        {
            bool isActive = await _supplierService.ToggleSupplierStatusAsync(id);
            return Ok(isActive); 
        }
    }
}
