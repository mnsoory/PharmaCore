using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PharmaCore.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSupplierFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Suppliers",
                newName: "ContactPerson");

            migrationBuilder.RenameColumn(
                name: "Company",
                table: "Suppliers",
                newName: "CompanyName");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Suppliers",
                type: "nvarchar(150)",
                maxLength: 150,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Suppliers_CompanyName",
                table: "Suppliers",
                column: "CompanyName",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Suppliers_CompanyName",
                table: "Suppliers");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Suppliers");

            migrationBuilder.RenameColumn(
                name: "ContactPerson",
                table: "Suppliers",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "CompanyName",
                table: "Suppliers",
                newName: "Company");
        }
    }
}
