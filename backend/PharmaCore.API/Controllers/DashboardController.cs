using Microsoft.AspNetCore.Mvc;
using PharmaCore.Core.DTOs.Dashboard;
using PharmaCore.Core.Interfaces.Services;

namespace PharmaCore.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly ISaleService _saleService;
        private readonly IStockBatchService _stockBatchService;
        private readonly ISupplierService _supplierService;

        public DashboardController(
            ISaleService saleService,
            IStockBatchService stockBatchService,
            ISupplierService supplierService)
        {
            _saleService = saleService;
            _stockBatchService = stockBatchService;
            _supplierService = supplierService;
        }

        [HttpGet("summary")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<DashboardSummaryDto>> GetSummary()
        {
            var today = DateTime.UtcNow.Date;
            var tomorrow = today.AddDays(1);

            var todayRevenueData = await _saleService.GetSalesSummaryAsync(today, tomorrow);
            var lowStockDrugs = await _stockBatchService.GetLowStockDrugsAsync();
            var expiringSoon = await _stockBatchService.GetExpiringBatchesCategorizedAsync();
            var expiredBatches = await _stockBatchService.GetExpiredBatchesAsync();
            var suppliers = await _supplierService.GetAllAsync();

            var summary = new DashboardSummaryDto
            {
                TodaySalesAmount = todayRevenueData.TotalRevenue,
                TodaySalesCount = todayRevenueData.SalesCount,

                LowStockCount = lowStockDrugs.Count(),
                LowStockDrugs = lowStockDrugs.ToList(),

                ExpiringSoonCount = expiringSoon.Within30Days.Count + expiringSoon.Within60Days.Count + expiringSoon.Within90Days.Count,
                ExpiringSoonBatches = expiringSoon.Within30Days.Concat(expiringSoon.Within60Days).Concat(expiringSoon.Within90Days).ToList(),

                ExpiredCount = expiredBatches.Count(),
                ExpiredBatches = expiredBatches.ToList(),

                TotalRevenue = todayRevenueData.TotalRevenue,
                ActiveSuppliersCount = suppliers.Count(s => s.IsActive)
            };

            return Ok(summary);
        }
    }
}