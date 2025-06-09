using MediSchedule.Application.Interface;
using MediSchedule.Domain.Interfaces;
using MediSchedule.Infrastructure.Persistence.Data;
using MediSchedule.Infrastructure.Persistence.Data.Repositories;
using MediSchedule.Infrastructure.Persistence;
using MediSchedule.Infrastructure.Services;
using System.Reflection;
using MediatR;
using MediSchedule.Infrastructure.Hubs;
using MediSchedule.Infrastructure.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace MediSchedule.Infrastructure.Configuration;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(
                    connectionString: configuration["ConnectionStrings:DefaultConnection"],
                    sqlServerOptionsAction: sqlOptions =>
                    {
                        sqlOptions.EnableRetryOnFailure(
                            maxRetryCount: 5,
                            maxRetryDelay: TimeSpan.FromSeconds(30),
                            errorNumbersToAdd: null);
                    }),
            contextLifetime: ServiceLifetime.Scoped,
            optionsLifetime: ServiceLifetime.Singleton);
        
        services.AddScoped(typeof(IRepository<>), typeof(GenericRepository<>));
        
       services.AddScoped<IPatientRepository, PatientRepository>();
       services.AddScoped<IDoctorRepository, DoctorRepository>();
       services.AddScoped<IAppointmentRepository, AppointmentRepository>();
       services.AddScoped<IChatMessageRepository, ChatMessageRepository>();
       services.AddScoped<IChatSessionRepository, ChatSessionRepository>();
       services.AddScoped<IUserRepository, UserRepository>();
       services.AddScoped<ISlotRepository, SlotRepository>();
       services.AddScoped<INotificationRepository, NotificationRepository>();
       services.AddScoped<IProfileRepository, ProfileRepository>();
       services.AddScoped<ISpecialtyRepository, SpecialtyRepository>();
       services.AddScoped<IRefreshRepository, RefreshRepository>();
       services.AddScoped<IStatisticRepository, StatisticsRepository>();
       services.AddScoped<IPrescriptionRepository, PrescriptionRepository>();
       services.AddScoped<IMedicineRepository, MedicineRepository>();
       services.AddScoped<IHospitalRepository, HospitalRepository>();
       
       services.AddSingleton<IBlobService, AzureBlobService>();
       services.AddScoped<IAuthService, AuthService>();
       services.AddScoped<IMailService, MailService>();
       services.AddScoped<INotificationService, NotificationService>();
       services.AddScoped<IChatService, ChatService>();
       services.AddScoped<IPaymentGateway, MomoGateway>();
       
       // services.AddHttpClient<IPaymentGateway, MomoGateway>(client => {
       // });
       // services.AddHttpClient<ChatHub>();
       services.AddHttpClient();

       services.AddScoped<IUnitOfWork, UnitOfWork>();
        
        return services;
    }
    
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddSignalR();
        
        services.AddControllers();
        return services;
    }
}