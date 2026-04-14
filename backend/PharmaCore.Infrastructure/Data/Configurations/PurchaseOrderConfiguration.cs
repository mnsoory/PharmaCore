

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PharmaCore.Core.Entities;
using PharmaCore.Core.Enums;

namespace PharmaCore.Infrastructure.Data.Configurations
{
    public class PurchaseOrderConfiguration : IEntityTypeConfiguration<PurchaseOrder>
    {
        public void Configure(EntityTypeBuilder<PurchaseOrder> builder)
        {
            builder.ToTable("PurchaseOrders");
            builder.HasKey(po => po.PurchaseOrderId);

            builder.Property(po => po.Status)
                .HasConversion<string>()
                .HasMaxLength(20)
                .IsRequired()
                .HasDefaultValue(PurchaseOrderStatus.Pending);

            builder.Property(po => po.CreatedAt)
                .HasDefaultValueSql("GETDATE()");

            builder.HasOne(po => po.User)
               .WithMany(u => u.PurchaseOrders)
               .HasForeignKey(po => po.UserId)
               .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(po => po.Supplier)
            .WithMany(s => s.PurchaseOrders)
            .HasForeignKey(po => po.SupplierId)
            .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(po => po.UserId);
            builder.HasIndex(po => po.SupplierId);
            builder.HasIndex(po => po.Status);
        }
    }
}
