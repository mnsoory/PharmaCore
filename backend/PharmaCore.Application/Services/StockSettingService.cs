using AutoMapper;
using PharmaCore.Core.DTOs.StockSetting;
using PharmaCore.Core.Entities;
using PharmaCore.Core.Exceptions;
using PharmaCore.Core.Interfaces;
using PharmaCore.Core.Interfaces.Services;

namespace PharmaCore.Application.Services
{
    public class StockSettingService : IStockSettingService
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;

        public StockSettingService(IUnitOfWork uow, IMapper mapper)
        {
            _uow = uow;
            _mapper = mapper;
        }

        public async Task<StockSettingResponseDto> GetByDrugIdAsync(int drugId)
        {
            var setting = await _uow.StockSettings.GetByDrugIdAsync(drugId);

            if (setting == null)
                throw new NotFoundException($"Stock Setting for drug with ID: {drugId} was not found.");

            return _mapper.Map<StockSettingResponseDto>(setting);
        }

        public async Task<IEnumerable<StockSettingResponseDto>> GetAllSettingsAsync()
        {
            var settings = await _uow.StockSettings.GetAllWithDrugsAsync();
            return _mapper.Map<IEnumerable<StockSettingResponseDto>>(settings);
        }

        public async Task UpsertSettingAsync(StockSettingUpsertDto dto)
        {
            var setting = _mapper.Map<StockSetting>(dto);
            await _uow.StockSettings.UpsertAsync(setting);
            await _uow.CompleteAsync();
        }

        public async Task DeleteSettingAsync(int drugId)
        {
            var setting = await _uow.StockSettings.GetByDrugIdAsync(drugId);
            if (setting != null)
            {
                _uow.StockSettings.Delete(setting);
                await _uow.CompleteAsync();
            }
        }
    }
}