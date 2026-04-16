using Microsoft.AspNetCore.Mvc;
using PharmaCore.Core.DTOs.StockBatch;
using PharmaCore.Core.Interfaces.Services;

namespace PharmaCore.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StockBatchesController : ControllerBase
    {
        private readonly IStockBatchService _stockBatchService;

        public StockBatchesController(IStockBatchService stockBatchService)
        {
            _stockBatchService = stockBatchService;
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<StockBatchResponseDto>> GetById(int id)
        {
            var result = await _stockBatchService.GetByIdAsync(id);
            return Ok(result);
        }

        [HttpGet("drug/{drugId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<StockBatchResponseDto>>> GetByDrugId(int drugId)
        {
            var result = await _stockBatchService.GetByDrugIdAsync(drugId);
            return Ok(result);
        }

        [HttpGet("drug/{drugId}/available")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<StockBatchResponseDto>>> GetAvailableForSale(int drugId)
        {
            var result = await _stockBatchService.GetAvailableBatchesForSaleAsync(drugId);
            return Ok(result);
        }

        [HttpGet("expired")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<StockBatchResponseDto>>> GetExpired()
        {
            var result = await _stockBatchService.GetExpiredBatchesAsync();
            return Ok(result);
        }

    }
}