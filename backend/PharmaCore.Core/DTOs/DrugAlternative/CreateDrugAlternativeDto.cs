

using System.ComponentModel.DataAnnotations;

namespace PharmaCore.Core.DTOs.DrugAlternative
{
    public class CreateDrugAlternativeDto
    {
        [Required(ErrorMessage = "Drug ID is required")]
        public int DrugId { get; set; }

        [Required(ErrorMessage = "Alternative Drug ID is required")]
        public int AlternativeDrugId { get; set; }
    }
}
