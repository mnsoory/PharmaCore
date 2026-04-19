using AutoMapper;
using AutoMapper.QueryableExtensions;
using PharmaCore.Core.DTOs.StockBatch;
using PharmaCore.Core.Entities;
using PharmaCore.Core.Exceptions;
using PharmaCore.Core.Interfaces;
using PharmaCore.Core.Interfaces.Services;

namespace PharmaCore.Application.Services
{
    public class StockBatchService : IStockBatchService
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;

        public StockBatchService(IUnitOfWork uow, IMapper mapper)
        {
            _uow = uow;
            _mapper = mapper;
        }

        public async Task<StockBatchResponseDto> GetByIdAsync(int id)
        {
            var batch = await _uow.StockBatches.GetByIdAsync(id);
            if (batch == null)
                throw new NotFoundException($"Stock Batch with ID {id} not found.");

            return _mapper.Map<StockBatchResponseDto>(batch);
        }

        public async Task<IEnumerable<StockBatchResponseDto>> GetByDrugIdAsync(int drugId)
        {
            var batches = await _uow.StockBatches.GetByDrugIdAsync(drugId);
            return _mapper.Map<IEnumerable<StockBatchResponseDto>>(batches);
        }

        public async Task<IEnumerable<StockBatchResponseDto>> GetAvailableBatchesForSaleAsync(int drugId)
        {
            var batches = await _uow.StockBatches.GetActiveBatchesByDrugIdAsync(drugId);
            return _mapper.Map<IEnumerable<StockBatchResponseDto>>(batches);
        }

        public async Task<IEnumerable<StockBatchResponseDto>> GetExpiredBatchesAsync()
        {
            var batches = await _uow.StockBatches.GetExpiredBatchesAsync();
            return _mapper.Map<IEnumerable<StockBatchResponseDto>>(batches);
        }

        public async Task<StockBatch> CreateBatchEntityAsync(CreateStockBatchInternalDto dto)
        {
            if (dto.ExpiryDate <= dto.ProductionDate)
                throw new BusinessException("Expiry date must be after production date.");

            if (dto.Quantity <= 0)
                throw new BusinessException("Batch quantity must be greater than zero.");

            if (!await _uow.Drugs.ExistsAsync(dto.DrugId))
                throw new NotFoundException($"Drug with ID {dto.DrugId} not found.");

            if (!await _uow.Suppliers.ExistsAsync(dto.SupplierId))
                throw new NotFoundException($"Supplier with ID {dto.SupplierId} not found.");

            return new StockBatch
            {
                DrugId = dto.DrugId,
                SupplierId = dto.SupplierId,
                PurchaseOrderItemId = dto.PurchaseOrderItemId,
                Quantity = dto.Quantity,
                RemainingQty = dto.Quantity,
                PurchasePrice = dto.PurchasePrice,
                BatchNumber = dto.BatchNumber,
                ExpiryDate = dto.ExpiryDate,
                ProductionDate = dto.ProductionDate
            };
        }

        public async Task<ExpiringBatchesDto> GetExpiringBatchesCategorizedAsync()
        {
            var allBatches = await _uow.StockBatches.GetAllExpiringSoonAsync(90);
            var today = DateTime.UtcNow;

            var result = new ExpiringBatchesDto
            {
                Within30Days = _mapper.Map<List<StockBatchResponseDto>>(
                    allBatches.Where(b => b.ExpiryDate <= today.AddDays(30))),

                Within60Days = _mapper.Map<List<StockBatchResponseDto>>(
                    allBatches.Where(b => b.ExpiryDate > today.AddDays(30) && b.ExpiryDate <= today.AddDays(60))),

                Within90Days = _mapper.Map<List<StockBatchResponseDto>>(
                    allBatches.Where(b => b.ExpiryDate > today.AddDays(60) && b.ExpiryDate <= today.AddDays(90)))
            };

            return result;
        }

        public async Task<IEnumerable<LowStockDrugDto>> GetLowStockDrugsAsync()
        {
            var query = _uow.Drugs.GetQueryable()
                .ProjectTo<LowStockDrugDto>(_mapper.ConfigurationProvider)
                .Where(x => x.CurrentStock <= x.MinimumStockThreshold);

            return await Task.Run(() => query.ToList());
        }
    }
}