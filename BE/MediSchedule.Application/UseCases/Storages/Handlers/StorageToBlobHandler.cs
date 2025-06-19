using MediatR;
using MediSchedule.Application.Interface;
using MediSchedule.Application.UseCases.Storages.Commands;
using MediSchedule.Domain.Interfaces;

namespace MediSchedule.Application.UseCases.Storages.Handlers;

public class StorageToBlobHandler(
    IAppointmentRepository appointmentRepository,
    IBlobService blobService,
    IMailService mailService,
    IUnitOfWork unitOfWork
    ) : IRequestHandler<StorageToBlobCommand, string>
{
    public async Task<string> Handle(StorageToBlobCommand request, CancellationToken cancellationToken)
    {
        var blobUrl = await blobService.UploadFileAsync(request.ContainerName, request.File);
        
        var appointment = await appointmentRepository.GetByIdAsync(request.AppointmentId);
        if (appointment is not null)
        {
            var url = appointment.FileUrl;
            if (appointment.FileUrl is not null)
                await blobService.DeleteFileAsync(appointment.FileUrl);
            
            appointment.FileUrl = blobUrl;
            
            await appointmentRepository.UpdateAsync(appointment);
            
            await unitOfWork.CommitAsync();
            
            var emailBody = $@"
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset='UTF-8' />
                <style>
                    body {{{{ 
                        font-family: Arial, sans-serif; 
                        line-height: 1.6; 
                        background-color: #f4f4f4; 
                        padding: 20px;
                    }}}}
                    .container {{{{ 
                        max-width: 600px; 
                        margin: 0 auto; 
                        background: #ffffff; 
                        padding: 20px; 
                        border-radius: 8px; 
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }}}}
                    .header {{{{ 
                        color: #2c3e50; 
                        text-align: center; 
                        margin-bottom: 20px;
                    }}}}
                    .details {{{{ 
                        margin-bottom: 20px; 
                    }}}}
                    .details td {{{{ 
                        padding: 4px 8px; 
                    }}}}
                    .button {{{{ 
                        display: inline-block; 
                        padding: 12px 24px; 
                        background-color: #28a745; 
                        color: white !important; 
                        text-decoration: none; 
                        border-radius: 5px; 
                        margin-top: 20px;
                    }}}}
                    .footer {{{{ 
                        margin-top: 30px; 
                        text-align: center; 
                        color: #7f8c8d; 
                        font-size: 0.9em; 
                    }}}}
                    img.receipt-img {{{{ 
                        max-width: 100%; 
                        height: auto; 
                        border: 1px solid #ddd; 
                        border-radius: 4px; 
                        margin-top: 10px;
                    }}}}
                </style>
            </head>
            <body>
                <div class='container'>
                    <h1 class='header'>🩺 Phiếu khám của bạn đã sẵn sàng!</h1>

                    <p>Xin chào <strong>{appointment.FullName}</strong>,</p>

                    <p>Bạn đã hoàn tất thanh toán và đặt lịch khám thành công với thông tin:</p>
                    <table class='details'>
                        <tr>
                            <td><strong>Mã lịch hẹn:</strong></td>
                            <td>{appointment.Id}</td>
                        </tr>
                        <tr>
                            <td><strong>Ngày khám:</strong></td>
                            <td>{appointment.AppointmentDate:yyyy-MM-dd}</td>
                        </tr>
                        <tr>
                            <td><strong>Giờ khám:</strong></td>
                            <td>{appointment.AppointmentTime}</td>
                        </tr>
                        <tr>
                            <td><strong>Bác sĩ:</strong></td>
                            <td>{appointment.Doctor.Profile!.FullName}</td>
                        </tr>
                        <tr>
                            <td><strong>Họ tên:</strong></td>
                            <td>{appointment.FullName}</td>
                        </tr>
                        <tr>
                            <td><strong>Liên hệ:</strong></td>
                            <td>{appointment.Phone} / {appointment.Email}</td>
                        </tr>
                    </table>

                    <p>Dưới đây là phiếu khám (dưới dạng ảnh) của bạn. Bạn cũng có thể tải về hoặc in ra khi cần:</p>
                    <a href='{blobUrl}' class='button' target='_blank'>Xem/Tải phiếu khám</a>

                    <div>
                        <img src='{blobUrl}' alt='Phiếu khám' class='receipt-img' />
                    </div>

                    <div class='footer'>
                        <p>Nếu có bất kỳ thắc mắc nào, xin vui lòng liên hệ chúng tôi qua email <a href='mailto:sonysam.contacts@gmail.com'>sonysam.contacts@gmail.com</a> hoặc số hotline <strong>1900-1234</strong>.</p>
                        <p>© 2025 MediSchedule. Bản quyền được bảo lưu.</p>
                    </div>
                </div>
            </body>
            </html>";
            
            await mailService.SendEmailAsync(
                appointment.Email,
                "🎉 Đặt lịch thành công",
                emailBody
            );
        }
        
        return blobUrl;
    }
}