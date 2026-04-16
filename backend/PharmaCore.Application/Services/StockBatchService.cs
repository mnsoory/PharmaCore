using AutoMapper;
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

        public async Task UpdateRemainingQuantityAsync(int batchId, int quantityToSubtract)
        {
            var batch = await _uow.StockBatches.GetByIdAsync(batchId);
            if (batch == null)
                throw new NotFoundException("Stock batch not found.");

            if (batch.RemainingQty < quantityToSubtract)
                throw new BusinessException($"Insufficient quantity in batch {batch.BatchNumber}. Available: {batch.RemainingQty}");

            batch.RemainingQty -= quantityToSubtract;
            _uow.StockBatches.Update(batch);
            await _uow.CompleteAsync();
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
    }
}