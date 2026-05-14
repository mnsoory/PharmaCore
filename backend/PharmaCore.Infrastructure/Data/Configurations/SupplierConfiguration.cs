using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PharmaCore.Core.Entities;

namespace PharmaCore.Infrastructure.Data.Configurations
{
    public class SupplierConfiguration : IEntityTypeConfiguration<Supplier>
    {
        public void Configure(EntityTypeBuilder<Supplier> builder)
        {
            builder.ToTable("Suppliers");
            builder.HasKey(s => s.SupplierId);

            builder.Property(s => s.CompanyName)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(s => s.ContactPerson)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(s => s.Phone)
                .IsRequired()
                .HasMaxLength(20);

            builder.Property(s => s.Email)
                .HasMaxLength(150);

            builder.Property(s => s.IsActive)
                .IsRequired()
                .HasDefaultValue(true);

            builder.HasIndex(s => s.Phone)
                .IsUnique();

            builder.HasIndex(s => s.CompanyName)
                .IsUnique();

            builder.HasQueryFilter(s => s.IsActive);

            builder.HasMany(s => s.PurchaseOrders)
                .WithOne(po => po.Supplier)
                .HasForeignKey(po => po.SupplierId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(s => s.StockBatches)
                .WithOne(sb => sb.Supplier)
                .HasForeignKey(sb => sb.SupplierId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}