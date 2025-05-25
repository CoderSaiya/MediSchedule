using System.Linq.Expressions;
using MediSchedule.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace MediSchedule.Infrastructure.Persistence.Data;

public class GenericRepository<T>(AppDbContext context) : IRepository<T> where T : class
{
    public async Task<T?> GetByIdAsync(Guid id) => 
        await context.Set<T>().FindAsync(id);

    public async Task<IEnumerable<T>> ListAsync() => await context.Set<T>().ToListAsync();

    public async Task<IEnumerable<T>> ListAsync(Expression<Func<T, bool>> predicate) =>
        await context.Set<T>().Where(predicate).ToListAsync();


    public async Task<IEnumerable<T>> ListAsync<TFilter>(TFilter filter)
        where TFilter : class
    {
        IQueryable<T> query = context.Set<T>();
        
        foreach (var prop in typeof(TFilter).GetProperties())
        {
            var value = prop.GetValue(filter);
            if (value == null) continue;


            var entityProp = typeof(T).GetProperty(prop.Name);
            if (entityProp == null) continue;
            
            var param = Expression.Parameter(typeof(T), "x");
            var left = Expression.Property(param, entityProp);
            var right = Expression.Constant(value);
            var equal = Expression.Equal(left, right);
            var lambda = Expression.Lambda<Func<T, bool>>(equal, param);

            query = query.Where(lambda);
        }

        return await query.ToListAsync();
    }

    public async Task AddAsync(T entity) => await context.Set<T>().AddAsync(entity);

    public Task UpdateAsync(T entity)
    {
        context.Set<T>().Update(entity);
        return Task.CompletedTask;
    }

    public async Task DeleteAsync(Guid id)
    {
        var e = await context.Set<T>().FindAsync(id);
        if (e != null) context.Set<T>().Remove(e);
    }

    public async Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate) =>
        await context.Set<T>().AnyAsync(predicate);

    public async Task<bool> ExistsAsync(Guid id) =>
        await context.Set<T>().FindAsync(id) is not null;
}