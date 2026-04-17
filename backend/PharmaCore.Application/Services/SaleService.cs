using AutoMapper;
using PharmaCore.Core.DTOs.Sale;
using PharmaCore.Core.Entities;
using PharmaCore.Core.Enums;
using PharmaCore.Core.Exceptions;
using PharmaCore.Core.Interfaces;
using PharmaCore.Core.Interfaces.Services;

namespace PharmaCore.Application.Services
{
    public class SaleService : ISaleService
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;
        private readonly IUserContextService _userContextService;

        public SaleService(IUnitOfWork uow, IMapper mapper, IUserContextService userContextService)
        {
            _uow = uow;
            _mapper = mapper;
            _userContextService = userContextService;
        }

        public async Task<SaleResponseDto> CreateSaleAsync(CreateSaleDto dto)
        {
            await _uow.BeginTransactionAsync();
            try
            {
                var sale = _mapper.Map<Sale>(dto);
                sale.UserId = _userContextService.GetUserId();

                decimal calculatedTotalAmount = 0;

                foreach (var item in sale.SaleItems)
                {
                    var batch = await _uow.StockBatches.GetByIdAsync(item.BatchId);
                    if (batch == null)
                        throw new BusinessException($"The stock batch with ID {item.BatchId} does not exist in the system.");

                    if (batch.RemainingQty < item.Quantity)
                        throw new BusinessException($"Insufficient stock in batch {batch.BatchNumber}. Available: {batch.RemainingQty}");

                    batch.RemainingQty -= item.Quantity;
                    item.UnitPrice = batch.PurchasePrice;
                    item.DrugId = batch.DrugId;
                    calculatedTotalAmount += (item.UnitPrice * item.Quantity);
                }

                sale.TotalAmount = Math.Max(0, calculatedTotalAmount - dto.Discount);

                await _uow.Sales.AddAsync(sale);
                await _uow.CompleteAsync();
                await _uow.CommitAsync();

                var result = await _uow.Sales.GetByIdAsync(sale.SaleId);
                return _mapper.Map<SaleResponseDto>(result);
            }
            catch (Exception)
            {
                await _uow.RollbackAsync();
                throw;
            }
        }

        public async Task<SaleResponseDto> GetSaleByIdAsync(int id)
        {
            var sale = await _uow.Sales.GetByIdAsync(id);
            if (sale == null) throw new NotFoundException($"Sale {id} not found.");
            return _mapper.Map<SaleResponseDto>(sale);
        }

        public async Task<IEnumerable<SaleResponseDto>> GetCurrentUserSalesAsync()
        {
            var userId = _userContextService.GetUserId();
            var sales = await _uow.Sales.GetByUserIdAsync(userId);
            return _mapper.Map<IEnumerable<SaleResponseDto>>(sales);
        }

        public async Task<IEnumerable<SaleResponseDto>> GetSalesByUserIdAsync(int userId)
        {
            var sales = await _uow.Sales.GetByUserIdAsync(userId);
            return _mapper.Map<IEnumerable<SaleResponseDto>>(sales);
        }

        public async Task<IEnumerable<SaleResponseDto>> GetSalesReportAsync(DateTime from, DateTime to)
        {
            var sales = await _uow.Sales.GetSalesByDateRangeAsync(from, to);
            return _mapper.Map<IEnumerable<SaleResponseDto>>(sales);
        }

        public async Task<decimal> GetRevenueReportAsync(DateTime from, DateTime to)
        {
            return await _uow.Sales.GetTotalRevenueAsync(from, to);
        }

        public async Task<int> GetSalesCountReportAsync(DateTime from, DateTime to)
        {
            return await _uow.Sales.GetSalesCountAsync(from, to);
        }

        public async Task<IEnumerable<SaleResponseDto>> GetAllSalesAsync()
        {
            var sales = await _uow.Sales.GetAllAsync();
            return _mapper.Map<IEnumerable<SaleResponseDto>>(sales);
        }
    }
}