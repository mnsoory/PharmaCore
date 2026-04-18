using AutoMapper;
using PharmaCore.Core.DTOs.Sale;
using PharmaCore.Core.DTOs.SaleCancellation;
using PharmaCore.Core.Entities;
using PharmaCore.Core.Exceptions;
using PharmaCore.Core.Interfaces;
using PharmaCore.Core.Interfaces.Services;

namespace PharmaCore.Application.Services
{
    public class SaleCancellationService : ISaleCancellationService
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;

        public SaleCancellationService(IUnitOfWork uow, IMapper mapper)
        {
            _uow = uow;
            _mapper = mapper;
        }

        public async Task<SaleCancellationResponseDto> CancelSaleAsync(CreateSaleCancellationDto dto)
        {
            await _uow.BeginTransactionAsync();
            try
            {
                var sale = await _uow.Sales.GetByIdAsync(dto.SaleId);
                if (sale == null) throw new BusinessException($"Sale {dto.SaleId} not found.");

                var existingCancellation = await _uow.SaleCancellations.GetBySaleIdAsync(dto.SaleId);
                if (existingCancellation != null) throw new BusinessException("Sale is already cancelled.");

                foreach (var item in sale.SaleItems)
                {
                    var batch = await _uow.StockBatches.GetByIdAsync(item.BatchId);
                    if (batch != null)
                    {
                        batch.RemainingQty += item.Quantity;
                    }
                }

                var cancellation = new SaleCancellation
                {
                    SaleId = dto.SaleId,
                    Reason = dto.Reason
                };

                await _uow.SaleCancellations.AddAsync(cancellation);
                await _uow.CompleteAsync();
                await _uow.CommitAsync();

                var result = await _uow.SaleCancellations.GetByIdAsync(cancellation.SaleCancellationId);
                return _mapper.Map<SaleCancellationResponseDto>(result);
            }
            catch
            {
                await _uow.RollbackAsync();
                throw;
            }
        }

        public async Task<SaleCancellationResponseDto> GetByIdAsync(int id)
        {
            var saleCancellation = await _uow.SaleCancellations.GetByIdAsync(id);
            if (saleCancellation == null) throw new NotFoundException($"Sale Cancellation with ID: {id} not found.");
            return _mapper.Map<SaleCancellationResponseDto>(saleCancellation);
        }

        public async Task<IEnumerable<SaleResponseDto>> GetAllCancelledSalesAsync()
        {
            var cancellations = await _uow.SaleCancellations.GetAllAsync();
            var cancelledSales = cancellations.Select(c => c.Sale);

            return _mapper.Map<IEnumerable<SaleResponseDto>>(cancelledSales);
        }
    }
}