

namespace PharmaCore.Core.Entities
{
    public class DrugAlternative
    {
        public int DrugId { get; set; }
        public Drug Drug { get; set; } = null!;

        public int AlternativeDrugId { get; set; }
        public Drug AlternativeDrug { get; set; } = null!;
    }
}
