

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PharmaCore.Core.Entities;
using PharmaCore.Core.Enums;

namespace PharmaCore.Infrastructure.Data.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("Users");
            builder.HasKey(u => u.UserId);

            builder.HasIndex(u => u.Username).IsUnique();
            builder.HasIndex(u => u.Email).IsUnique();

            builder.Property(u => u.Username)
           .IsRequired()
           .HasMaxLength(50);

            builder.Property(u => u.Firstname)
                   .IsRequired()
                   .HasMaxLength(50);

            builder.Property(u => u.Lastname)
                   .IsRequired()
                   .HasMaxLength(50);

            builder.Property(u => u.Email)
                   .IsRequired()
                   .HasMaxLength(150);

            builder.Property(u => u.Phone)
                   .HasMaxLength(20);
            builder.HasIndex(u => u.Phone).IsUnique();

            builder.Property(u => u.PasswordHash)
                    .HasMaxLength(500)
                   .IsRequired();

            builder.Property(u => u.Role)
                   .IsRequired()
                   .HasDefaultValue((byte)UserRole.Pharmacist);
            builder.HasIndex(u => u.Role);

            // Default Values for Flags
            builder.Property(u => u.IsActive)
                   .HasDefaultValue(true);

            builder.Property(u => u.IsDeleted)
                   .HasDefaultValue(false);

            // Global Query Filter (Soft Delete)
            builder.HasQueryFilter(u => !u.IsDeleted);
        }
    }
}
