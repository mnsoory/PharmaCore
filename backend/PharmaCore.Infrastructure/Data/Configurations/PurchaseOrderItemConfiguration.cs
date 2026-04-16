

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PharmaCore.Core.Entities;

namespace PharmaCore.Infrastructure.Data.Configurations
{
    public class PurchaseOrderItemConfiguration : IEntityTypeConfiguration<PurchaseOrderItem>
    {
        public void Configure(EntityTypeBuilder<PurchaseOrderItem> builder)
        {
            builder.ToTable("PurchaseOrderItems");
            builder.HasKey(poi => poi.PurchaseOrderItemId);

            builder.Property(poi => poi.Quantity)
                .IsRequired();

            builder.Property(poi => poi.ReceivedQuantity)
                .IsRequired()
                .HasDefaultValue(0);

            builder.ToTable(t => t.HasCheckConstraint("CK_PurchaseOrderItem_ReceivedQuantity_Range",
                $"[{nameof(PurchaseOrderItem.ReceivedQuantity)}] >= 0 AND " +
                $"[{nameof(PurchaseOrderItem.ReceivedQuantity)}] <= [{nameof(PurchaseOrderItem.Quantity)}]"));

            builder.Property(poi => poi.UnitPrice)
                .IsRequired()
                .HasColumnType("decimal(18,2)");

            builder.HasOne(poi => poi.PurchaseOrder)
                .WithMany(po => po.Items)
                .HasForeignKey(poi => poi.PurchaseOrderId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(poi => poi.Drug)
                .WithMany()
                .HasForeignKey(poi => poi.DrugId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
