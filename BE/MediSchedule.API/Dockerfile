FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["MediSchedule.API/MediSchedule.API.csproj", "MediSchedule.API/"]
COPY ["MediSchedule.Domain/MediSchedule.Domain.csproj", "MediSchedule.Domain/"]
COPY ["MediSchedule.Application/MediSchedule.Application.csproj", "MediSchedule.Application/"]
COPY ["MediSchedule.Infrastructure/MediSchedule.Infrastructure.csproj", "MediSchedule.Infrastructure/"]
RUN dotnet restore "MediSchedule.API/MediSchedule.API.csproj"
COPY . .
WORKDIR "/src/MediSchedule.API"
RUN dotnet build "MediSchedule.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "MediSchedule.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

RUN mkdir -p /app/Certificates
COPY ./Certificates/aspnetapp.pfx /app/Certificates/aspnetapp.pfx

RUN chmod $APP_UID /app/Certificates/aspnetapp.pfx

ENV ASPNETCORE_URLS="http://+:8080;https://+:443"
ENV Kestrel__Certificates__Default__Path=/app/Certificates/aspnetapp.pfx

USER $APP_UID
ENTRYPOINT ["dotnet", "MediSchedule.API.dll"]