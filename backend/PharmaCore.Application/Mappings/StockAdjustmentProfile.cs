using AutoMapper;
using PharmaCore.Core.DTOs.StockAdjustment;
using PharmaCore.Core.Entities;

namespace PharmaCore.Application.Mappings
{
    public class StockAdjustmentProfile : Profile
    {
        public StockAdjustmentProfile()
        {
            CreateMap<CreateStockAdjustmentDto, StockAdjustment>();

            CreateMap<StockAdjustment, StockAdjustmentResponseDto>()
                .ForMember(dest => dest.DrugId, opt => opt.MapFrom(src => src.StockBatch.Drug.DrugId))
                .ForMember(dest => dest.DrugName, opt => opt.MapFrom(src => src.StockBatch.Drug.TradeName))
                .ForMember(dest => dest.BatchNumber, opt => opt.MapFrom(src => src.StockBatch.BatchNumber))
                .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.User.Username))
                .ForMember(dest => dest.AdjustmentType, opt => opt.MapFrom(src => src.AdjustmentType.ToString()));
        }
    }
}