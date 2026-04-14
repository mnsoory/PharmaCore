

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
