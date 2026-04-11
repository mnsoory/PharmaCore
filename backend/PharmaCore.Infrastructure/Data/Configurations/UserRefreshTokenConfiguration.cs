

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PharmaCore.Core.Entities;

namespace PharmaCore.Infrastructure.Data.Configurations
{
    public class UserRefreshTokenConfiguration : IEntityTypeConfiguration<UserRefreshToken>
    {
        public void Configure(EntityTypeBuilder<UserRefreshToken> builder)
        {
            builder.ToTable("UserRefreshTokens");

            builder.HasKey(r => r.UserRefreshTokenId);

            builder.Property(r => r.Token)
                .IsRequired()
                .HasMaxLength(500);

            builder.Property(r => r.JwtId)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(r => r.CreationDate)
                .IsRequired()
                .HasDefaultValueSql("GETUTCDATE()");

            builder.Property(r => r.ExpiryDate)
                .IsRequired();

            // Default values for flags
            builder.Property(r => r.IsUsed)
                .HasDefaultValue(false);

            builder.Property(r => r.IsRevoked)
                .HasDefaultValue(false);

            // Relationships
            builder.HasOne(r => r.User)
                .WithMany() 
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(r => r.Token)
                .IsUnique();

            builder.HasIndex(r => r.UserId);
        }
    }
}
