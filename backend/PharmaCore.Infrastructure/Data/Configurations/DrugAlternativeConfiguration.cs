

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PharmaCore.Core.Entities;

namespace PharmaCore.Infrastructure.Data.Configurations
{
    public class DrugAlternativeConfiguration : IEntityTypeConfiguration<DrugAlternative>
    {
        public void Configure(EntityTypeBuilder<DrugAlternative> builder)
        {
            builder.HasKey(da => new { da.DrugId, da.AlternativeDrugId });

            builder.HasOne(da => da.Drug)
                .WithMany(d => d.Alternatives)
                .HasForeignKey(da => da.DrugId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(da => da.AlternativeDrug)
                .WithMany()
                .HasForeignKey(da => da.AlternativeDrugId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(da => new { da.AlternativeDrugId, da.DrugId }).IsUnique();

            builder.ToTable(t => t.HasCheckConstraint("CK_DrugAlternative_NoSelfAlternative", "[DrugId] <> [AlternativeDrugId]"));
            builder.ToTable(t => t.HasCheckConstraint("CK_DrugAlternative_UniqueSymmetricPair", "[DrugId] < [AlternativeDrugId]"));
        }
    }
}
