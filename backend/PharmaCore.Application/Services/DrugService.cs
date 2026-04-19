

using AutoMapper;
using PharmaCore.Core.DTOs.Drug;
using PharmaCore.Core.Entities;
using PharmaCore.Core.Exceptions;
using PharmaCore.Core.Interfaces;
using PharmaCore.Core.Interfaces.Services;

namespace PharmaCore.Application.Services
{
    public class DrugService : IDrugService
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;

        public DrugService(IMapper mapper, IUnitOfWork uow)
        {
            _mapper = mapper;
            _uow = uow;
        }

        public async Task<DrugResponseDto> CreateAsync(CreateDrugDto createDto)
        {
            if (await _uow.Drugs.ExistsCompositeAsync(createDto.TradeName, createDto.Concentration, createDto.Form, createDto.Manufacturer))
                throw new BusinessException("A drug with the same trade name, concentration, form, and manufacturer already exists.");

            Drug drugEntity = _mapper.Map<Drug>(createDto);
            await _uow.Drugs.AddAsync(drugEntity);

            drugEntity.StockSetting = new StockSetting
            {
                MinimumStock = createDto.MinimumStock ?? 10
            };

            await _uow.CompleteAsync();

            return _mapper.Map<DrugResponseDto>(drugEntity);
        }

        public async Task DeleteAsync(int id)
        {
            var drug = await _uow.Drugs.GetByIdAsync(id);

            if (drug == null)
                throw new NotFoundException($"Drug with ID: {id} was not found.");

            drug.IsDeleted = true;
            await _uow.CompleteAsync();
        }

        public async Task<IEnumerable<DrugResponseDto>> GetAllAsync()
        {
            var drugs = await _uow.Drugs.GetAllActiveAsync();
            var drugsDto = _mapper.Map<IEnumerable<DrugResponseDto>>(drugs);

            return drugsDto;
        }

        public async Task<DrugResponseDto?> GetByIdAsync(int id)
        {
            var drug = await _uow.Drugs.GetByIdAsync(id);

            if(drug == null)
                throw new NotFoundException($"Drug with ID: {id} was not found.");

            return _mapper.Map<DrugResponseDto>(drug);
        }

        public async Task<bool> IsTradeNameExistsAsync(string tradeName)
        {
            return await _uow.Drugs.TradeNameExistsAsync(tradeName);
        }

        public async Task<IEnumerable<DrugResponseDto>> SearchAsync(string searchTerm)
        {
            var drugs = await _uow.Drugs.SearchAsync(searchTerm);

            var drugsDto = _mapper.Map<IEnumerable<DrugResponseDto>>(drugs);

            return drugsDto;
        }

        public async Task UpdateAsync(int id, UpdateDrugDto updateDto)
        {
            var drug = await _uow.Drugs.GetByIdAsync(id);

            if (drug == null)
                throw new NotFoundException($"Drug with ID: {id} was not found.");

            _mapper.Map(updateDto, drug);

            await _uow.CompleteAsync();
        }
    }
}
