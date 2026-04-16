

using AutoMapper;
using PharmaCore.Core.DTOs.StockAdjustment;
using PharmaCore.Core.Entities;
using PharmaCore.Core.Enums;
using PharmaCore.Core.Exceptions;
using PharmaCore.Core.Interfaces;
using PharmaCore.Core.Interfaces.Services;

namespace PharmaCore.Application.Services
{
    public class StockAdjustmentService : IStockAdjustmentService
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;
        private readonly IUserContextService _userContextService;

        public StockAdjustmentService(IUnitOfWork uow, IMapper mapper, IUserContextService userContextService)
        {
            _uow = uow;
            _mapper = mapper;
            _userContextService = userContextService;
        }

        public async Task<IEnumerable<StockAdjustmentResponseDto>> GetAdjustmentsByDrugIdAsync(int drugId)
        {
            if (!await _uow.Drugs.ExistsAsync(drugId))
                throw new BusinessException($"Invalid Request: Drug with ID {drugId} does not exist in our records.");

            var adjustments = await _uow.StockAdjustments.GetByDrugIdAsync(drugId);
            return _mapper.Map<IEnumerable<StockAdjustmentResponseDto>>(adjustments);
        }
        public async Task<StockAdjustmentResponseDto> CreateAdjustmentAsync(CreateStockAdjustmentDto dto)
        {
            var batch = await _uow.StockBatches.GetByIdAsync(dto.StockBatchId);
            if (batch == null)
                throw new BusinessException($"Data Inconsistency: The specified Stock Batch (ID: {dto.StockBatchId}) was not found.");

            var adjustmentType = Enum.Parse<StockAdjustmentType>(dto.AdjustmentType);
            await _uow.BeginTransactionAsync();
            try
            {
                var adjustment = _mapper.Map<StockAdjustment>(dto);
                adjustment.UserId = _userContextService.GetUserId();

                int actualQuantityToSubtract = (adjustmentType == StockAdjustmentType.Addition || adjustmentType == StockAdjustmentType.ReturnFromCustomer)
                    ? -dto.Quantity
                    : dto.Quantity;

                if (batch.RemainingQty < actualQuantityToSubtract)
                    throw new BusinessException($"Insufficient quantity in batch {batch.BatchNumber}. Available: {batch.RemainingQty}");

                batch.RemainingQty -= actualQuantityToSubtract;

                await _uow.StockAdjustments.AddAsync(adjustment);
                await _uow.CompleteAsync();
                await _uow.CommitAsync();

                var savedAdjustment = await _uow.StockAdjustments.GetByIdAsync(adjustment.StockAdjustmentId);
                return _mapper.Map<StockAdjustmentResponseDto>(savedAdjustment);
            }
            catch (Exception)
            {
                await _uow.RollbackAsync();
                throw;
            }
        }
    }
}
