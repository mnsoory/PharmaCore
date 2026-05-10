

using AutoMapper;
using PharmaCore.Core.DTOs.Drug;
using PharmaCore.Core.Entities;

namespace PharmaCore.Application.Mappings
{
    public class DrugProfile : Profile
    {
        public DrugProfile()
        {
            CreateMap<Drug, DrugResponseDto>()
                .ForMember(dest => dest.MinimumStock, opt => opt.MapFrom(src =>
        src.StockSetting != null ? src.StockSetting.MinimumStock : 0));

            CreateMap<CreateDrugDto, Drug>()
                .ForMember(dest => dest.TradeName, opt => opt.MapFrom(src => src.TradeName.Trim()));

            CreateMap<UpdateDrugDto, Drug>()
                .ForMember(dest => dest.TradeName, opt => opt.MapFrom(src => src.TradeName.Trim()));

            CreateMap<Drug, TopSellingDrugDto>()
                .ForMember(dest => dest.TotalSoldQuantity, opt => opt.MapFrom(src => src.StockBatches.Sum(s => s.SaleItems.Sum(si => si.Quantity))))
                .ForMember(dest => dest.CurrentStockQuantity, opt => opt.MapFrom(src => src.StockBatches.Sum(s => s.Quantity)));
        }
    }
}
