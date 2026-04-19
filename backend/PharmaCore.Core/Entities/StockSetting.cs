

namespace PharmaCore.Core.Entities
{
    public class StockSetting
    {
        public int DrugId { get; set; }
        public int MinimumStock { get; set; }

        public virtual Drug Drug { get; set; }
    }
}
