using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PharmaCore.Core.DTOs.Sale;
using PharmaCore.Core.DTOs.SaleCancellation;
using PharmaCore.Core.Interfaces.Services;

namespace PharmaCore.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SaleCancellationsController : ControllerBase
    {
        private readonly ISaleCancellationService _cancellationService;

        public SaleCancellationsController(ISaleCancellationService cancellationService)
        {
            _cancellationService = cancellationService;
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<SaleCancellationResponseDto>> Create([FromBody] CreateSaleCancellationDto dto)
        {
            var result = await _cancellationService.CancelSaleAsync(dto);
            return CreatedAtRoute("GetCancellationById", new { id = result.SaleCancellationId }, result);
        }

        [HttpGet("{id}", Name = "GetCancellationById")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<SaleCancellationResponseDto>> GetById(int id)
        {
            var cancellation = await _cancellationService.GetByIdAsync(id);
            return Ok(cancellation);
        }

        [HttpGet("cancelled-sales")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<SaleResponseDto>>> GetCancelledSales()
        {
            var result = await _cancellationService.GetAllCancelledSalesAsync();
            return Ok(result);
        }
    }
}