

namespace PharmaCore.Core.DTOs.StockBatch
{
    public class ExpiringBatchesDto
    {
        public List<StockBatchResponseDto> Within30Days { get; set; } = new();
        public List<StockBatchResponseDto> Within60Days { get; set; } = new();
        public List<StockBatchResponseDto> Within90Days { get; set; } = new();
    }
}
