

using AutoMapper;
using PharmaCore.Core.DTOs.Sale;
using PharmaCore.Core.Entities;

namespace PharmaCore.Application.Mappings
{
    public class SaleMappingProfile : Profile
    {
        public SaleMappingProfile()
        {
            CreateMap<CreateSaleDto, Sale>()
                .ForMember(dest => dest.SaleItems, opt => opt.MapFrom(src => src.SaleItems));

            CreateMap<CreateSaleItemDto, SaleItem>();

            CreateMap<Sale, SaleResponseDto>()
                .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.User.Username))
                .ForMember(dest => dest.PaymentMethod, opt => opt.MapFrom(src => src.PaymentMethod.ToString()));

            CreateMap<SaleItem, SaleItemResponseDto>()
                .ForMember(dest => dest.DrugName, opt => opt.MapFrom(src => src.Drug.TradeName))
                .ForMember(dest => dest.BatchNumber, opt => opt.MapFrom(src => src.Batch.BatchNumber));
        }
    }
}
