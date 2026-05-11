using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TutoringPlatform.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateModelsAndFixDbSet : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "isOnline",
                table: "TutoringAds",
                newName: "IsOnline");

            migrationBuilder.RenameColumn(
                name: "isAvailable",
                table: "TutoringAds",
                newName: "IsAvailable");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsOnline",
                table: "TutoringAds",
                newName: "isOnline");

            migrationBuilder.RenameColumn(
                name: "IsAvailable",
                table: "TutoringAds",
                newName: "isAvailable");
        }
    }
}
