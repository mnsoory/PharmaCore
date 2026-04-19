

using AutoMapper;
using PharmaCore.Core.DTOs.StockSetting;
using PharmaCore.Core.Entities;

namespace PharmaCore.Application.Mappings
{
    public class StockSettingProfile : Profile
    {
        public StockSettingProfile()
        {
            CreateMap<StockSettingUpsertDto, StockSetting>();
            CreateMap<StockSetting, StockSettingResponseDto>()
                .ForMember(dest => dest.DrugTradeName, opt => opt.MapFrom(src => src.Drug.TradeName))
                .ForMember(dest => dest.Concentration, opt => opt.MapFrom(src => src.Drug.Concentration));
        }
    }
}
