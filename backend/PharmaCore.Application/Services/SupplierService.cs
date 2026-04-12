

using AutoMapper;
using PharmaCore.Core.DTOs.Supplier;
using PharmaCore.Core.Entities;
using PharmaCore.Core.Exceptions;
using PharmaCore.Core.Interfaces.Repositories;
using PharmaCore.Core.Interfaces.Services;

namespace PharmaCore.Application.Services
{
    public class SupplierService : ISupplierService
    {
        private readonly ISupplierRepository _supplierRepository;
        private readonly IMapper _mapper;

        public SupplierService(ISupplierRepository supplierRepository, IMapper mapper)
        {
            _supplierRepository = supplierRepository;
            _mapper = mapper;
        }

        public async Task<SupplierResponseDto> CreateAsync(CreateSupplierDto createDto)
        {
            var existingPhone = await _supplierRepository.ExistsByPhoneAsync(createDto.Phone);

            if (existingPhone)
            {
                throw new ConflictException($"Supplier with phone {createDto.Phone} already exists in the system.");
            }

            var supplierEntity = _mapper.Map<Supplier>(createDto);
            await _supplierRepository.AddAsync(supplierEntity);

            return _mapper.Map<SupplierResponseDto>(supplierEntity);
        }

        public async Task<bool> ToggleSupplierStatusAsync(int id)
        {
            var supplier = await _supplierRepository.GetByIdIgnoreQueryFilterAsync(id);

            if (supplier == null) 
                throw new NotFoundException("Supplier not found.");

            supplier.IsActive = !supplier.IsActive;
            await _supplierRepository.UpdateAsync(supplier);
            return supplier.IsActive;
        }

        public async Task<IEnumerable<SupplierResponseDto>> GetAllAsync()
        {
            var suppliers = await _supplierRepository.GetAllAsync();
            var suppliersDto = _mapper.Map<IEnumerable<SupplierResponseDto>>(suppliers);

            return suppliersDto;
        }

        public async Task<IEnumerable<SupplierResponseDto>> GetAllInActiveAsync()
        {
            var suppliers = await _supplierRepository.GetAllInActiveAsync();
            var suppliersDto = _mapper.Map<IEnumerable<SupplierResponseDto>>(suppliers);

            return suppliersDto;
        }

        public async Task<SupplierResponseDto> GetByIdAsync(int id)
        {
            var supplier = await _supplierRepository.GetByIdAsync(id);

            if (supplier == null)
                throw new NotFoundException($"Supplier with ID: {id} was not found.");

            return _mapper.Map<SupplierResponseDto>(supplier);
        }

        public async Task UpdateAsync(int id, UpdateSupplierDto updateDto)
        {
            var supplier = await _supplierRepository.GetByIdAsync(id);

            if (supplier == null)
                throw new NotFoundException($"Supplier with ID: {id} was not found.");

            _mapper.Map(updateDto, supplier);
            await _supplierRepository.UpdateAsync(supplier);
        }
    }
}
