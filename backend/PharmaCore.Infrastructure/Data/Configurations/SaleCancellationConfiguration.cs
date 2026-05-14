

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PharmaCore.Core.Entities;

namespace PharmaCore.Infrastructure.Data.Configurations
{
    public class SaleCancellationConfiguration : IEntityTypeConfiguration<SaleCancellation>
    {
        public void Configure(EntityTypeBuilder<SaleCancellation> builder)
        {
            builder.HasKey(sc => sc.SaleCancellationId);

            builder.Property(sc => sc.Reason)
                .IsRequired()
                .HasMaxLength(500);

            builder.Property(sc => sc.CancelledAt)
                .IsRequired()
                .HasDefaultValueSql("GETDATE()");

            builder.Property(sc => sc.CancelledByUserId)
                .IsRequired();

            builder.HasIndex(sc => sc.SaleId)
                .IsUnique();

            builder.HasIndex(sc => sc.SaleId)
                .IsUnique();


            builder.HasOne(sc => sc.Sale)
                .WithOne(s => s.Cancellation)
                .HasForeignKey<SaleCancellation>(sc => sc.SaleId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(sc => sc.CancelledByUser)
                .WithMany()
                .HasForeignKey(sc => sc.CancelledByUserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
