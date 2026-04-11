using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PharmaCore.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCompositeUniqueIndexToDrugs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Drugs_TradeName_Concentration_Form_Manufacturer",
                table: "Drugs",
                columns: new[] { "TradeName", "Concentration", "Form", "Manufacturer" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Drugs_TradeName_Concentration_Form_Manufacturer",
                table: "Drugs");
        }
    }
}
