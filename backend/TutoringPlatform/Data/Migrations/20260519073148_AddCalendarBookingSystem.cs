using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace TutoringPlatform.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddCalendarBookingSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsRecurring",
                table: "Lessons",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "RemainingLessons",
                table: "Lessons",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TutorAvailabilityId",
                table: "Lessons",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "TutorAvailabilities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TutoringAdId = table.Column<int>(type: "integer", nullable: false),
                    DayOfWeek = table.Column<int>(type: "integer", nullable: false),
                    StartTime = table.Column<TimeSpan>(type: "interval", nullable: false),
                    EndTime = table.Column<TimeSpan>(type: "interval", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TutorAvailabilities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TutorAvailabilities_TutoringAds_TutoringAdId",
                        column: x => x.TutoringAdId,
                        principalTable: "TutoringAds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Lessons_TutorAvailabilityId",
                table: "Lessons",
                column: "TutorAvailabilityId");

            migrationBuilder.CreateIndex(
                name: "IX_TutorAvailabilities_TutoringAdId",
                table: "TutorAvailabilities",
                column: "TutoringAdId");

            migrationBuilder.AddForeignKey(
                name: "FK_Lessons_TutorAvailabilities_TutorAvailabilityId",
                table: "Lessons",
                column: "TutorAvailabilityId",
                principalTable: "TutorAvailabilities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Lessons_TutorAvailabilities_TutorAvailabilityId",
                table: "Lessons");

            migrationBuilder.DropTable(
                name: "TutorAvailabilities");

            migrationBuilder.DropIndex(
                name: "IX_Lessons_TutorAvailabilityId",
                table: "Lessons");

            migrationBuilder.DropColumn(
                name: "IsRecurring",
                table: "Lessons");

            migrationBuilder.DropColumn(
                name: "RemainingLessons",
                table: "Lessons");

            migrationBuilder.DropColumn(
                name: "TutorAvailabilityId",
                table: "Lessons");
        }
    }
}
