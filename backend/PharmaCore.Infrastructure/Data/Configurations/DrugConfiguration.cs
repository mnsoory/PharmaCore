using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PharmaCore.Core.Entities;

namespace PharmaCore.Infrastructure.Data.Configurations
{
    public class DrugConfiguration : IEntityTypeConfiguration<Drug>
    {
        public void Configure(EntityTypeBuilder<Drug> builder)
        {
            builder.ToTable("Drugs");

            builder.HasKey(d => d.DrugId);

            builder.Property(d => d.TradeName)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(d => d.GenericName)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(d => d.Manufacturer)
                .IsRequired()
                .HasMaxLength(150);

            builder.Property(d => d.Form)
                .HasMaxLength(50);

            builder.Property(d => d.Concentration)
                .HasMaxLength(50);

            builder.Property(d => d.Category)
                .HasMaxLength(100);

            builder.Property(d => d.RequiresPrescription)
                .HasDefaultValue(false);

            builder.Property(d => d.IsDeleted)
                .HasDefaultValue(false);

            builder.HasIndex(d => d.TradeName);
            builder.HasIndex(d => d.GenericName);

            builder.HasIndex(d => new { d.TradeName, d.Concentration, d.Form, d.Manufacturer })
                    .IsUnique()
                    .HasFilter(null);

            builder.HasQueryFilter(d => !d.IsDeleted);
        }
    }
}
