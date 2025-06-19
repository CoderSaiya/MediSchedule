using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MediSchedule.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class FixFKDoctorInSlot : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Slots_DoctorId",
                table: "Slots",
                column: "DoctorId",
                unique: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
