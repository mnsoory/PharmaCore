

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PharmaCore.Core.Entities;

namespace PharmaCore.Infrastructure.Data.Configurations
{
    public class StockAdjustmentConfiguration : IEntityTypeConfiguration<StockAdjustment>
    {
        public void Configure(EntityTypeBuilder<StockAdjustment> builder)
        {
            builder.ToTable("StockAdjustments");

            builder.HasKey(x => x.StockAdjustmentId);

            builder.Property(x => x.Quantity)
                .IsRequired();

            builder.Property(x => x.Reason)
                .IsRequired()
                .HasMaxLength(500);

            builder.Property(x => x.AdjustmentType)
                .IsRequired()
                .HasMaxLength(20)
                .HasConversion<string>();

            builder.Property(x => x.AdjustmentDate)
                .IsRequired()
                .HasDefaultValueSql("GETUTCDATE()");

            builder.HasIndex(x => x.StockBatchId);
            builder.HasIndex(x => x.AdjustmentDate);

            builder.HasOne(x => x.StockBatch)
                .WithMany()
                .HasForeignKey(x => x.StockBatchId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.User)
                .WithMany()
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
