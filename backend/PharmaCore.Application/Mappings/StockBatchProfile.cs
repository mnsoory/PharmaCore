

using AutoMapper;
using PharmaCore.Core.DTOs.StockBatch;
using PharmaCore.Core.Entities;

namespace PharmaCore.Application.Mappings
{
    public class StockBatchProfile : Profile
    {
        public StockBatchProfile()
        {
            CreateMap<StockBatch, StockBatchResponseDto>()
                .ForMember(dest => dest.DrugName, opt => opt.MapFrom(src => src.Drug.TradeName))
                .ForMember(dest => dest.SupplierName, opt => opt.MapFrom(src => src.Supplier.Name));

            CreateMap<Drug, LowStockDrugDto>()
                .ForMember(dest => dest.CurrentStock,
                    opt => opt.MapFrom(src => src.StockBatches.Sum(b => b.Quantity)))
                .ForMember(dest => dest.MinimumStockThreshold,
                    opt => opt.MapFrom(src => src.StockSetting != null ? src.StockSetting.MinimumStock : 10));
        }
    }
}
