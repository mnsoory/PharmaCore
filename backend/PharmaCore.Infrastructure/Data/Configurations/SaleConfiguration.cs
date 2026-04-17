

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PharmaCore.Core.Entities;

namespace PharmaCore.Infrastructure.Data.Configurations
{
    public class SaleConfiguration : IEntityTypeConfiguration<Sale>
    {
        public void Configure(EntityTypeBuilder<Sale> builder)
        {
            builder.HasKey(e => e.SaleId);

            builder.Property(e => e.TotalAmount)
                .IsRequired()
                .HasPrecision(18, 2);

            builder.Property(e => e.Discount)
                .IsRequired()
                .HasPrecision(18, 2);

            builder.Property(e => e.PaymentMethod)
                .IsRequired()
                .HasMaxLength(30)
                .HasConversion<string>();

            builder.Property(e => e.SaleDate)
                .IsRequired()
                .HasDefaultValueSql("GETDATE()");

            builder.HasMany(s => s.SaleItems)
                 .WithOne(si => si.Sale)
                 .HasForeignKey(si => si.SaleId)
                 .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(e => e.UserId);
        }
    }
}
