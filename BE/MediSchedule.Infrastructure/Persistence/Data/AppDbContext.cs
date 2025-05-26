using MediSchedule.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace MediSchedule.Infrastructure.Persistence.Data;

public class AppDbContext : Microsoft.EntityFrameworkCore.DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Profile> Profiles { get; set; }
    public DbSet<Specialty> Specialties { get; set; }
    public DbSet<Doctor> Doctors { get; set; }
    public DbSet<Appointment> Appointments { get; set; }
    public DbSet<ChatMessage> ChatMessages { get; set; }
    public DbSet<ChatSession> ChatSessions { get; set; }
    public DbSet<Slot> Slots { get; set; }
    public DbSet<Patient> Patients { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<Review> Reviews { get; set; }
    
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasDiscriminator<string>("Role")
                .HasValue<Patient>("Patient")
                .HasValue<Doctor>("Doctor")
                .HasValue<User>("User")
                .HasValue<Admin>("Admin");
        });

        modelBuilder.Entity<Appointment>(a =>
        {
            a.HasOne(x => x.Doctor)
                .WithMany(x => x.Appointments)
                .HasForeignKey(x => x.DoctorId)
                .OnDelete(DeleteBehavior.Restrict);

            a.HasOne(x => x.Patient)
                .WithMany()
                .HasForeignKey(x => x.PatientId)
                .OnDelete(DeleteBehavior.Restrict);
        });
        
        modelBuilder.Entity<Doctor>()
            .HasMany(d => d.Slots)
            .WithOne(s => s.Doctor)
            .HasForeignKey(s => s.DoctorId)
            .OnDelete(DeleteBehavior.Cascade);
        
        modelBuilder.Entity<Slot>()
            .HasIndex(s => s.DoctorId)
            .IsUnique(false);
    }
}