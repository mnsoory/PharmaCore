

using AutoMapper;
using PharmaCore.Core.DTOs.Supplier;
using PharmaCore.Core.Entities;

namespace PharmaCore.Application.Mappings
{
    public class SupplierProfile : Profile
    {
        public SupplierProfile()
        {
            CreateMap<Supplier, SupplierResponseDto>()
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.CompanyName));

            CreateMap<CreateSupplierDto, Supplier>()
                .ForMember(dest => dest.SupplierId, opt => opt.Ignore())
                .ForMember(dest => dest.CompanyName, opt => opt.MapFrom(src => src.SupplierName))
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true));

            CreateMap<UpdateSupplierDto, Supplier>();
        }

    }
}
