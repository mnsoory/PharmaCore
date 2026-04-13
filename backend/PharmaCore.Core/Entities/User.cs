using PharmaCore.Core.Enums;
using System;


namespace PharmaCore.Core.Entities
{
    public class User
    {
        public int UserId { get; set; }
        public string Username { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Email { get; set; }
        public string? Phone { get; set; }
        public string PasswordHash { get; set; }
        public UserRole Role { get; set; } 
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }

        public virtual ICollection<PurchaseOrder> PurchaseOrders { get; set; } = new HashSet<PurchaseOrder>();
    }
}
