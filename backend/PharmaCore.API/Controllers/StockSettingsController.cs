using Microsoft.AspNetCore.Mvc;
using PharmaCore.Core.DTOs.StockSetting;
using PharmaCore.Core.Interfaces.Services;

namespace PharmaCore.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StockSettingsController : ControllerBase
    {
        private readonly IStockSettingService _stockSettingService;

        public StockSettingsController(IStockSettingService stockSettingService)
        {
            _stockSettingService = stockSettingService;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<StockSettingResponseDto>>> GetAll()
        {
            var settings = await _stockSettingService.GetAllSettingsAsync();
            return Ok(settings);
        }

        [HttpGet("{drugId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<StockSettingResponseDto>> GetByDrugId(int drugId)
        {
            var setting = await _stockSettingService.GetByDrugIdAsync(drugId);
            return Ok(setting);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> Upsert(StockSettingUpsertDto dto)
        {
            await _stockSettingService.UpsertSettingAsync(dto);
            return NoContent();
        }

        [HttpDelete("{drugId}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> Delete(int drugId)
        {
            await _stockSettingService.DeleteSettingAsync(drugId);
            return NoContent();
        }
    }
}