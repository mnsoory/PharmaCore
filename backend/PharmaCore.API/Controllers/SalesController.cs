using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PharmaCore.Core.DTOs.Sale;
using PharmaCore.Core.Interfaces.Services;

namespace PharmaCore.API.Controllers
{
    //[Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class SalesController : ControllerBase
    {
        private readonly ISaleService _saleService;

        public SalesController(ISaleService saleService)
        {
            _saleService = saleService;
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        //[ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<SaleResponseDto>> Create([FromBody] CreateSaleDto dto)
        {
            var result = await _saleService.CreateSaleAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.SaleId }, result);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<SaleResponseDto>> GetById(int id)
        {
            var result = await _saleService.GetSaleByIdAsync(id);
            return Ok(result);
        }

        [HttpGet("my-sales")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<SaleResponseDto>>> GetMySales()
        {
            var result = await _saleService.GetCurrentUserSalesAsync();
            return Ok(result);
        }

        //[Authorize(Roles = "Admin")]
        [HttpGet("user/{userId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        //[ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<IEnumerable<SaleResponseDto>>> GetByUserId(int userId)
        {
            var result = await _saleService.GetSalesByUserIdAsync(userId);
            return Ok(result);
        }

        //[Authorize(Roles = "Admin")]
        [HttpGet("all")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<SaleResponseDto>>> GetAll()
        {
            var result = await _saleService.GetAllSalesAsync();
            return Ok(result);
        }

        //[Authorize(Roles = "Admin")]
        [HttpGet("report")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<SaleResponseDto>>> GetReport([FromQuery] DateTime from, [FromQuery] DateTime to)
        {
            var result = await _saleService.GetSalesReportAsync(from, to);
            return Ok(result);
        }

        //[Authorize(Roles = "Admin")]
        [HttpGet("revenue")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<decimal>> GetRevenue([FromQuery] DateTime from, [FromQuery] DateTime to)
        {
            var result = await _saleService.GetRevenueReportAsync(from, to);
            return Ok(result);
        }

        //[Authorize(Roles = "Admin")]
        [HttpGet("count")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<int>> GetCount([FromQuery] DateTime from, [FromQuery] DateTime to)
        {
            var result = await _saleService.GetSalesCountReportAsync(from, to);
            return Ok(result);
        }
    }
}