using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PharmaCore.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDrugAlternativesTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DrugAlternatives",
                columns: table => new
                {
                    DrugId = table.Column<int>(type: "int", nullable: false),
                    AlternativeDrugId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DrugAlternatives", x => new { x.DrugId, x.AlternativeDrugId });
                    table.CheckConstraint("CK_DrugAlternative_NoSelfAlternative", "[DrugId] <> [AlternativeDrugId]");
                    table.CheckConstraint("CK_DrugAlternative_UniqueSymmetricPair", "[DrugId] < [AlternativeDrugId]");
                    table.ForeignKey(
                        name: "FK_DrugAlternatives_Drugs_AlternativeDrugId",
                        column: x => x.AlternativeDrugId,
                        principalTable: "Drugs",
                        principalColumn: "DrugId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DrugAlternatives_Drugs_DrugId",
                        column: x => x.DrugId,
                        principalTable: "Drugs",
                        principalColumn: "DrugId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DrugAlternatives_AlternativeDrugId_DrugId",
                table: "DrugAlternatives",
                columns: new[] { "AlternativeDrugId", "DrugId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DrugAlternatives");
        }
    }
}
