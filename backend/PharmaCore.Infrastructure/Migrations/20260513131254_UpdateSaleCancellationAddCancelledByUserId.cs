using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PharmaCore.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSaleCancellationAddCancelledByUserId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SaleItems_StockBatches_BatchId",
                table: "SaleItems");

            migrationBuilder.AddColumn<int>(
                name: "CancelledByUserId",
                table: "SaleCancellations",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_SaleCancellations_CancelledByUserId",
                table: "SaleCancellations",
                column: "CancelledByUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_SaleCancellations_Users_CancelledByUserId",
                table: "SaleCancellations",
                column: "CancelledByUserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SaleItems_StockBatches_BatchId",
                table: "SaleItems",
                column: "BatchId",
                principalTable: "StockBatches",
                principalColumn: "StockBatchId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SaleCancellations_Users_CancelledByUserId",
                table: "SaleCancellations");

            migrationBuilder.DropForeignKey(
                name: "FK_SaleItems_StockBatches_BatchId",
                table: "SaleItems");

            migrationBuilder.DropIndex(
                name: "IX_SaleCancellations_CancelledByUserId",
                table: "SaleCancellations");

            migrationBuilder.DropColumn(
                name: "CancelledByUserId",
                table: "SaleCancellations");

            migrationBuilder.AddForeignKey(
                name: "FK_SaleItems_StockBatches_BatchId",
                table: "SaleItems",
                column: "BatchId",
                principalTable: "StockBatches",
                principalColumn: "StockBatchId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
