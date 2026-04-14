

using AutoMapper;
using PharmaCore.Core.DTOs.PurchaseOrder;
using PharmaCore.Core.DTOs.PurchaseOrderItem;
using PharmaCore.Core.Entities;

namespace PharmaCore.Application.Mappings
{
    public class PurchaseOrderProfile : Profile
    {
        public PurchaseOrderProfile()
        {
            CreateMap<CreatePurchaseOrderItemDto, PurchaseOrderItem>();

            CreateMap<CreatePurchaseOrderDto, PurchaseOrder>();

            CreateMap<PurchaseOrderItem, PurchaseOrderItemResponseDto>()
                .ForMember(dest => dest.DrugName, opt => opt.MapFrom(src => src.Drug.TradeName))
                .ForMember(dest => dest.TotalPrice, opt => opt.MapFrom(src => src.UnitPrice * src.Quantity));

            CreateMap<PurchaseOrder, PurchaseOrderResponseDto>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.Username))
                .ForMember(dest => dest.SupplierName, opt => opt.MapFrom(src => src.Supplier.Name))
                .ForMember(dest => dest.OrderDate, opt => opt.MapFrom(src => src.CreatedAt));
        }
    }
}
