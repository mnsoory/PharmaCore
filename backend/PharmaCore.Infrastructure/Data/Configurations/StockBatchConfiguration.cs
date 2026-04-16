

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PharmaCore.Core.Entities;

namespace PharmaCore.Infrastructure.Data.Configurations
{
    public class StockBatchConfiguration : IEntityTypeConfiguration<StockBatch>
    {
        public void Configure(EntityTypeBuilder<StockBatch> builder)
        {
            builder.ToTable("StockBatches");
            builder.HasKey(s => s.StockBatchId);

            builder.Property(s => s.BatchNumber)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(s => s.ExpiryDate)
                .IsRequired();

            builder.Property(s => s.ProductionDate)
                .IsRequired();

            builder.Property(s => s.Quantity)
                .IsRequired();

            builder.Property(s => s.RemainingQty)
                .IsRequired();

            builder.Property(s => s.PurchasePrice)
                .IsRequired()
                .HasColumnType("decimal(18,2)");

            builder.HasIndex(b => new { b.DrugId, b.ExpiryDate })
                .HasDatabaseName("IX_StockBatches_DrugId_ExpiryDate");

            builder.HasIndex(b => new { b.DrugId, b.ExpiryDate, b.RemainingQty })
                .HasDatabaseName("IX_StockBatches_DrugId_ExpiryDate_RemainingQty");

            builder.HasOne(s => s.Supplier)
                .WithMany(sup => sup.StockBatches)
                .HasForeignKey(s => s.SupplierId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(s => s.Drug)
                .WithMany(d => d.StockBatches)
                .HasForeignKey(s => s.DrugId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(s => s.PurchaseOrderItem)
                .WithMany()
                .HasForeignKey(s => s.PurchaseOrderItemId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
