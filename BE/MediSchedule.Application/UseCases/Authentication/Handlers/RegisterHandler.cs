using MediatR;
using MediSchedule.Application.Interface;
using MediSchedule.Application.UseCases.Authentication.Command;
using MediSchedule.Domain.Entities;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Application.UseCases.Authentication.Handlers;

public class RegisterHandler(
    IUserRepository userRepository,
    IProfileRepository profileRepository,
    IAuthService authService,
    IMailService mailService,
    IUnitOfWork unitOfWork
) : IRequestHandler<RegisterCommand, Guid>
{
    public async Task<Guid> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        if (await userRepository.ExistsAsync(u => u.Email == request.Email))
            throw new Exception("User with this email already exists.");
        if (await userRepository.ExistsAsync(u => u.Username == request.Username))
            throw new Exception("User with this Username already exists.");
        
        var passwordHash = authService.HashPassword(request.Password);
        
        Patient patient = new Patient
        {
            Username = request.Username,
            Email = request.Email,
            Password = passwordHash,
        };
        await userRepository.AddAsync(patient);
        
        Profile profile = new Profile
        {
            UserId = patient.Id,
            FullName = request.FullName,
        };
        await profileRepository.AddAsync(profile);
        
        var emailBody = $@"
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8' />
            <style>
                body {{{{ font-family: Arial, sans-serif; line-height: 1.6; }}}}
                .container {{{{ max-width: 600px; margin: 20px auto; padding: 20px; }}}}
                .header {{{{ color: #2c3e50; text-align: center; }}}}
                .button {{{{
                    display: inline-block;
                    padding: 12px 24px;
                    background-color: #28a745;
                    color: white !important;
                    text-decoration: none;
                    border-radius: 5px;
                    margin: 20px 0;
                }}}}
                .footer {{{{ margin-top: 30px; text-align: center; color: #7f8c8d; font-size: 0.9em; }}}}
            </style>
        </head>
        <body>
            <div class='container'>
                <h1 class='header'>🎉 Chào mừng bạn đến với MediSchedule 🎉</h1>
                
                <p>Xin chào <strong>{{user.Username}}</strong>,</p>
                
                <p>Bạn đã đăng ký thành công tài khoản trên hệ thống <strong>MediSchedule</strong> – nền tảng đặt lịch khám bệnh trực tuyến tiện lợi và nhanh chóng.</p>
                
                <p>Bây giờ bạn có thể:</p>
                <ul>
                    <li>Đặt lịch khám với bác sĩ chuyên khoa phù hợp.</li>
                    <li>Quản lý lịch hẹn và nhận thông báo nhắc lịch.</li>
                    <li>Trò chuyện trực tiếp với bác sĩ và nhận kết quả khám online.</li>
                </ul>
                
                <p>Để bắt đầu, hãy nhấn vào nút bên dưới để đăng nhập và trải nghiệm:</p>
                
                <a href='http://localhost:3000/login' class='button'>Đăng nhập ngay</a>
                
                <div class='footer'>
                    <p>Nếu cần hỗ trợ, vui lòng liên hệ đội ngũ chăm sóc khách hàng tại <a href='mailto:sonysam.contacts@gmail.com'>support@sonysam.contacts@gmail.com</a></p>
                    <p>© 2025 MediSchedule. Bản quyền được bảo lưu.</p>
                </div>
            </div>
        </body>
        </html>";
        
        await mailService.SendEmailAsync(
            patient.Email,
            "🎉 Đăng ký tài khoản thành công",
            emailBody
        );
        
        await unitOfWork.CommitAsync();

        return patient.Id;
    }
}