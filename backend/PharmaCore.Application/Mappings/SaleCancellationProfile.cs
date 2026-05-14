

using AutoMapper;
using PharmaCore.Core.DTOs.SaleCancellation;
using PharmaCore.Core.Entities;

namespace PharmaCore.Application.Mappings
{
    public class SaleCancellationProfile : Profile
    {
        public SaleCancellationProfile()
        {
            CreateMap<SaleCancellation, SaleCancellationResponseDto>()
                .ForMember(dest => dest.CancelledBy, opt => opt.MapFrom(src => src.CancelledByUser.Username))
                .ForMember(dest => dest.Sale, opt => opt.MapFrom(src => src.Sale));
        }
    }
}
