

using AutoMapper;
using PharmaCore.Core.DTOs.Drug;
using PharmaCore.Core.Entities;
using PharmaCore.Core.Exceptions;
using PharmaCore.Core.Interfaces.Repositories;
using PharmaCore.Core.Interfaces.Services;

namespace PharmaCore.Application.Services
{
    public class DrugService : IDrugService
    {
        private readonly IDrugRepository _drugRepository;
        private readonly IMapper _mapper;

        public DrugService(IDrugRepository drugRepository, IMapper mapper)
        {
            _drugRepository = drugRepository;
            _mapper = mapper;
        }

        public async Task<DrugResponseDto> CreateAsync(CreateDrugDto createDto)
        {
            if (await _drugRepository.ExistsCompositeAsync(createDto.TradeName, createDto.Concentration, createDto.Form, createDto.Manufacturer))
                throw new BusinessException("A drug with the same trade name, concentration, form, and manufacturer already exists.");

            Drug drugEntity = _mapper.Map<Drug>(createDto);
            await _drugRepository.AddAsync(drugEntity);

            return _mapper.Map<DrugResponseDto>(drugEntity);
        }

        public async Task DeleteAsync(int id)
        {
            var drug = await _drugRepository.GetByIdAsync(id);

            if (drug == null)
                throw new NotFoundException($"Drug with ID: {id} was not found.");

            await _drugRepository.SoftDeleteAsync(id);
        }

        public async Task<IEnumerable<DrugResponseDto>> GetAllAsync()
        {
            var drugs = await _drugRepository.GetAllActiveAsync();
            var drugsDto = _mapper.Map<IEnumerable<DrugResponseDto>>(drugs);

            return drugsDto;
        }

        public async Task<DrugResponseDto?> GetByIdAsync(int id)
        {
            var drug = await _drugRepository.GetByIdAsync(id);

            if(drug == null)
                throw new NotFoundException($"Drug with ID: {id} was not found.");

            return _mapper.Map<DrugResponseDto>(drug);
        }

        public async Task<bool> IsTradeNameExistsAsync(string tradeName)
        {
            return await _drugRepository.ExistsAsync(tradeName);
        }

        public async Task<IEnumerable<DrugResponseDto>> SearchAsync(string searchTerm)
        {
            var drugs = await _drugRepository.SearchAsync(searchTerm);

            var drugsDto = _mapper.Map<IEnumerable<DrugResponseDto>>(drugs);

            return drugsDto;
        }

        public async Task UpdateAsync(int id, UpdateDrugDto updateDto)
        {
            var drug = await _drugRepository.GetByIdAsync(id);

            if (drug == null)
                throw new NotFoundException($"Drug with ID: {id} was not found.");

            _mapper.Map(updateDto, drug);

            await _drugRepository.UpdateAsync(drug);
        }
    }
}
