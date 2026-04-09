

using PharmaCore.Core.Enums;
using System.ComponentModel.DataAnnotations;

namespace PharmaCore.Core.DTOs.User
{
    public class UpdateRoleDto
    {
        [Required]
        [EnumDataType(typeof(UserRole), ErrorMessage = "Selected role does not exist.")]
        public string NewRole { get; set; } = string.Empty;
    }
}
