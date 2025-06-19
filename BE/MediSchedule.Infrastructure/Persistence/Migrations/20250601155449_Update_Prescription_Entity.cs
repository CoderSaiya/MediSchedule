using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MediSchedule.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Update_Prescription_Entity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FileUrl",
                table: "Prescriptions",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FileUrl",
                table: "Prescriptions");
        }
    }
}
