

namespace PharmaCore.Core.DTOs.Drug
{
    public class TopSellingDrugsResponse
    {
        public int DaysPeriod { get; set; }
        public DateTime StartDate { get; set; }
        public IEnumerable<TopSellingDrugDto> Drugs { get; set; } = new List<TopSellingDrugDto>();
    }
}
