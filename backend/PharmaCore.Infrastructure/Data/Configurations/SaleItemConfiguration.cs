
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PharmaCore.Core.Entities;

namespace PharmaCore.Infrastructure.Data.Configurations
{
    public class SaleItemConfiguration : IEntityTypeConfiguration<SaleItem>
    {
        public void Configure(EntityTypeBuilder<SaleItem> builder)
        {
            builder.HasKey(e => e.SaleItemId);

            builder.Property(e => e.Quantity)
                .IsRequired();

            builder.Property(e => e.UnitPrice)
                .IsRequired()
                .HasPrecision(18, 2);

            builder.HasOne(d => d.Sale)
                .WithMany(p => p.SaleItems)
                .HasForeignKey(d => d.SaleId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(e => e.SaleId);
            builder.HasIndex(e => e.DrugId);
            builder.HasIndex(e => e.BatchId);
        }
    }
}
