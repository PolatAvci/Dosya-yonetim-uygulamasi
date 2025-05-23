﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DosyaYonetimApi.Migrations
{
    /// <inheritdoc />
    public partial class GetFilesWithAuth : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "Files",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Files");
        }
    }
}
