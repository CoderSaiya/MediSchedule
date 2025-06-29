using System.Linq.Expressions;
using MediSchedule.Domain.Specifications;
using Microsoft.EntityFrameworkCore;

namespace MediSchedule.Infrastructure.Persistence.Data.Helpers;

public class StatsHelper
{
    public static async Task<DailyStatsResult> ComputeCountAsync<T>(
        IQueryable<T> source,
        Expression<Func<T, DateTime>> dateSelector,
        Expression<Func<T, bool>> filter,
        DateTime today,
        DateTime yesterday)
        where T : class
    {
        var query = source.Where(filter);
        
        var param = dateSelector.Parameters[0];
        var equalToday = Expression.Lambda<Func<T, bool>>(
            Expression.Equal(
                dateSelector.Body,
                Expression.Constant(today, typeof(DateTime))
            ),
            param
        );

        var equalYesterday = Expression.Lambda<Func<T, bool>>(
            Expression.Equal(
                dateSelector.Body,
                Expression.Constant(yesterday, typeof(DateTime))
            ),
            param
        );
        
        var totT = await query.Where(equalToday).CountAsync();
        var totY = await query.Where(equalYesterday).CountAsync();

        double delta = totY == 0
            ? (totT == 0 ? 0 : 100)
            : Math.Round((totT - totY) * 100.0 / totY, 0);

        return new DailyStatsResult
        {
            TotalToday = totT,
            TotalYesterday = totY,
            DeltaPercent = delta
        };
    }
}