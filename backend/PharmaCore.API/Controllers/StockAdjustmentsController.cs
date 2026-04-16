using Microsoft.AspNetCore.Mvc;
using PharmaCore.Core.DTOs.StockAdjustment;
using PharmaCore.Core.Interfaces.Services;
using System.Security.Claims;

namespace PharmaCore.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StockAdjustmentsController : ControllerBase
    {
        private readonly IStockAdjustmentService _adjustmentService;

        public StockAdjustmentsController(IStockAdjustmentService adjustmentService)
        {
            _adjustmentService = adjustmentService;
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<StockAdjustmentResponseDto>> Create(CreateStockAdjustmentDto dto)
        {
            var result = await _adjustmentService.CreateAdjustmentAsync(dto);
            return Ok(result);
        }

        [HttpGet("drug/{drugId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<IEnumerable<StockAdjustmentResponseDto>>> GetByDrug(int drugId)
        {
            var result = await _adjustmentService.GetAdjustmentsByDrugIdAsync(drugId);
            return Ok(result);
        }
    }
}