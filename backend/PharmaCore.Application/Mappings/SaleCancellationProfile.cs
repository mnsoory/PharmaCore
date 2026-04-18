

using AutoMapper;
using PharmaCore.Core.DTOs.SaleCancellation;
using PharmaCore.Core.Entities;

namespace PharmaCore.Application.Mappings
{
    public class SaleCancellationProfile : Profile
    {
        public SaleCancellationProfile()
        {
            CreateMap<SaleCancellation, SaleCancellationResponseDto>();
        }
    }
}
