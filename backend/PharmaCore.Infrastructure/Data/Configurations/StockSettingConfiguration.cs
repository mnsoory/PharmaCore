using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PharmaCore.Core.Entities;

namespace PharmaCore.Infrastructure.Data.Configurations
{
    public class StockSettingConfiguration : IEntityTypeConfiguration<StockSetting>
    {
        public void Configure(EntityTypeBuilder<StockSetting> builder)
        {
            builder.ToTable("StockSettings");
            builder.HasKey(s => s.DrugId);

            builder.HasOne(s => s.Drug)
                    .WithOne(d => d.StockSetting)
                    .HasForeignKey<StockSetting>(s => s.DrugId)
                    .OnDelete(DeleteBehavior.Cascade);

            builder.Property(s => s.MinimumStock)
                   .IsRequired()
                   .HasDefaultValue(10);
        }
    }
}