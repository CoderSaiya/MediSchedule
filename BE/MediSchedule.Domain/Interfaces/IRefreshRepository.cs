﻿using MediSchedule.Domain.Entities;

namespace MediSchedule.Domain.Interfaces;

public interface IRefreshRepository
{
    Task<RefreshToken?> GetByTokenAsync(string token);
    Task<RefreshToken?> GetValidTokenByUserAsync(Guid userId);
    Task<bool> HasValidTokenAsync(Guid userId);
    Task AddAsync(RefreshToken refreshToken);
    Task UpdateAsync(RefreshToken refreshToken);
}