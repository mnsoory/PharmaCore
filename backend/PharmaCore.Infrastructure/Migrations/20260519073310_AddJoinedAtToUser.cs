using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PharmaCore.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddJoinedAtToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "JoinedAt",
                table: "Users",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETUTCDATE()");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "JoinedAt",
                table: "Users");
        }
    }
}
