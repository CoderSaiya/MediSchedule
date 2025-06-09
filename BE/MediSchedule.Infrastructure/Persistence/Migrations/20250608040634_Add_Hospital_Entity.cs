using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MediSchedule.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Add_Hospital_Entity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Specialties_SpecialtyId",
                table: "Users");

            migrationBuilder.AddColumn<Guid>(
                name: "HospitalId",
                table: "Users",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "SpecialtyId1",
                table: "Users",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Hospitals",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Coordinates_Latitude = table.Column<double>(type: "double precision", nullable: false),
                    Coordinates_Longitude = table.Column<double>(type: "double precision", nullable: false),
                    CoverImage = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifyAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Hospitals", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_HospitalId",
                table: "Users",
                column: "HospitalId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_SpecialtyId1",
                table: "Users",
                column: "SpecialtyId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Hospitals_HospitalId",
                table: "Users",
                column: "HospitalId",
                principalTable: "Hospitals",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Specialties_SpecialtyId",
                table: "Users",
                column: "SpecialtyId",
                principalTable: "Specialties",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Specialties_SpecialtyId1",
                table: "Users",
                column: "SpecialtyId1",
                principalTable: "Specialties",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Hospitals_HospitalId",
                table: "Users");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Specialties_SpecialtyId",
                table: "Users");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Specialties_SpecialtyId1",
                table: "Users");

            migrationBuilder.DropTable(
                name: "Hospitals");

            migrationBuilder.DropIndex(
                name: "IX_Users_HospitalId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_SpecialtyId1",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "HospitalId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "SpecialtyId1",
                table: "Users");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Specialties_SpecialtyId",
                table: "Users",
                column: "SpecialtyId",
                principalTable: "Specialties",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
