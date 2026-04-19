

using AutoMapper;
using PharmaCore.Core.DTOs.PurchaseOrder;
using PharmaCore.Core.DTOs.StockBatch;
using PharmaCore.Core.Entities;
using PharmaCore.Core.Enums;
using PharmaCore.Core.Exceptions;
using PharmaCore.Core.Interfaces;
using PharmaCore.Core.Interfaces.Services;

namespace PharmaCore.Application.Services
{
    public class PurchaseOrderService : IPurchaseOrderService
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;
        private readonly IStockBatchService _stockBatchService;
        private readonly IUserContextService _userContextService;

        public PurchaseOrderService(IUnitOfWork uow, IMapper mapper, IStockBatchService stockBatchService, IUserContextService userContextService)
        {
            _uow = uow;
            _mapper = mapper;
            _stockBatchService = stockBatchService;
            _userContextService = userContextService;
        }

        public async Task<PurchaseOrderResponseDto> CreateAsync(CreatePurchaseOrderDto createDto)
        {
            if (!await _uow.Suppliers.ExistsAsync(createDto.SupplierId))
                throw new BusinessException("Supplier not found");

            var drugIds = createDto.Items.Select(i => i.DrugId).Distinct().ToList();

            var existingDrugsCount = await _uow.Drugs.CountByIdsAsync(drugIds);
            if (existingDrugsCount != drugIds.Count)
                throw new BusinessException("One or more drugs are invalid or do not exist.");

            var purchaseOrder = _mapper.Map<PurchaseOrder>(createDto);

            purchaseOrder.UserId = _userContextService.GetUserId();
            purchaseOrder.Status = PurchaseOrderStatus.Pending;

            await _uow.PurchaseOrders.AddAsync(purchaseOrder);
            await _uow.CompleteAsync();

            var savedOrder = await _uow.PurchaseOrders.GetWithDetailsAsync(purchaseOrder.PurchaseOrderId);

            return _mapper.Map<PurchaseOrderResponseDto>(savedOrder);
        }

        public async Task<IEnumerable<PurchaseOrderResponseDto>> GetAllAsync()
        {
            var purchaseOrders = await _uow.PurchaseOrders.GetAllAsync();
            var purchaseOrdersDto = _mapper.Map<IEnumerable<PurchaseOrderResponseDto>>(purchaseOrders);

            return purchaseOrdersDto;
        }

        public async Task<PurchaseOrderResponseDto> GetByIdAsync(int id)
        {
            var purchaseOrder = await _uow.PurchaseOrders.GetWithDetailsAsync(id);
            if (purchaseOrder == null)
                throw new NotFoundException($"Purchase Order with ID: {id} was not found.");

            return _mapper.Map<PurchaseOrderResponseDto>(purchaseOrder);
        }

        // Cancellation
        private async Task ProcessCancellationAsync(PurchaseOrder order)
        {
            if (order.Status == PurchaseOrderStatus.Cancelled)
                throw new BusinessException("Order is already cancelled.");

            if (order.Status == PurchaseOrderStatus.Pending) return;

            if (order.Status == PurchaseOrderStatus.PartiallyReceived || order.Status == PurchaseOrderStatus.Completed)
            {
                var itemIds = order.Items.Select(i => i.PurchaseOrderItemId).ToList();

                var hasUsedBatches = await _uow.StockBatches.HasAnyUsageByItemsAsync(itemIds);

                if (hasUsedBatches)
                    throw new BusinessException("Cannot cancel order: Some items from this order have already been sold or dispensed.");

                var batchesToRemove = await _uow.StockBatches.GetByItemIdsAsync(itemIds);

                _uow.StockBatches.RemoveRange(batchesToRemove);

                foreach (var item in order.Items)
                {
                    item.ReceivedQuantity = 0;
                }
            }
        }

        // Update Order status
        private void ValidateItemOwnership(PurchaseOrder order, List<int> sentItemIds)
        {
            var validItemIds = order.Items.Select(x => x.PurchaseOrderItemId).ToList();
            var invalidIds = sentItemIds.Except(validItemIds).ToList();
            if (invalidIds.Any())
                throw new BusinessException($"Security Alert: Items with IDs ({string.Join(",", invalidIds)}) do not belong to this order.");
        }

        private void ValidateItemQuantity(PurchaseOrderItem item, int totalInRequest, PurchaseOrderStatus requestedStatus)
        {
            if (totalInRequest <= 0)
                throw new BusinessException($"Quantity for item {item.Drug.TradeName} must be greater than zero.");

            if (item.ReceivedQuantity + totalInRequest > item.Quantity)
                throw new BusinessException($"Cannot receive {totalInRequest} units for {item.Drug.TradeName}. Already received: {item.ReceivedQuantity}/{item.Quantity}.");

            if (requestedStatus == PurchaseOrderStatus.Completed && (item.ReceivedQuantity + totalInRequest) != item.Quantity)
                throw new BusinessException($"Consistency Error: Item {item.Drug.TradeName} must reach total quantity of {item.Quantity} to be marked as Completed.");

            if (requestedStatus == PurchaseOrderStatus.PartiallyReceived && (item.ReceivedQuantity + totalInRequest) >= item.Quantity)
                throw new BusinessException($"Consistency Error: Item {item.Drug.TradeName} total received quantity would reach or exceed the target. Please mark as Completed instead.");
        }

        private async Task CreateAndRegisterBatches(PurchaseOrder order, PurchaseOrderItem item, List<BatchUpdateDataDto> itemBatches)
        {
            foreach (var batchData in itemBatches)
            {
                var batchDto = new CreateStockBatchInternalDto
                {
                    DrugId = item.DrugId,
                    SupplierId = order.SupplierId,
                    PurchaseOrderId = order.PurchaseOrderId,
                    PurchaseOrderItemId = item.PurchaseOrderItemId,
                    Quantity = batchData.Quantity,
                    PurchasePrice = item.UnitPrice,
                    BatchNumber = batchData.BatchNumber,
                    ExpiryDate = batchData.ExpiryDate,
                    ProductionDate = batchData.ProductionDate
                };

                var batch = await _stockBatchService.CreateBatchEntityAsync(batchDto);
                await _uow.StockBatches.AddAsync(batch);
            }
        }
        private async Task ProcessCompletionAsync(PurchaseOrder purchaseOrder, PurchaseOrderUpdateStatusDto updateDto, PurchaseOrderStatus requestedStatus)
        {
            if (purchaseOrder == null) throw new NotFoundException("Order details not found");

            if (updateDto.ItemsData == null || !updateDto.ItemsData.Any())
                throw new BusinessException("Batch details are required to process the order.");

            ValidateItemOwnership(purchaseOrder, updateDto.ItemsData.Select(x => x.PurchaseOrderItemId).Distinct().ToList());

            foreach (var item in purchaseOrder.Items)
            {
                var itemBatches = updateDto.ItemsData.Where(x => x.PurchaseOrderItemId == item.PurchaseOrderItemId).ToList();

                if (!itemBatches.Any())
                {
                    if (requestedStatus == PurchaseOrderStatus.Completed)
                    {
                        throw new BusinessException($"Item {item.Drug.TradeName} must be received to complete the order.");
                    }
                    continue;
                }

                var totalReceivedInThisRequest = itemBatches.Sum(x => x.Quantity);

                ValidateItemQuantity(item, totalReceivedInThisRequest, requestedStatus);

                await CreateAndRegisterBatches(purchaseOrder, item, itemBatches);

                item.ReceivedQuantity += totalReceivedInThisRequest;
            }
        }

        public async Task UpdateStatusAsync(int id, PurchaseOrderUpdateStatusDto updateDto)
        {
            var newStatus = Enum.Parse<PurchaseOrderStatus>(updateDto.NewStatus);
            var purchaseOrder = await _uow.PurchaseOrders.GetWithDetailsAsync(id);

            if (purchaseOrder == null)
                throw new NotFoundException($"Purchase Order with ID {id} not found");

            if (newStatus == purchaseOrder.Status && newStatus != PurchaseOrderStatus.PartiallyReceived)
                throw new BusinessException($"The order is already marked as {updateDto.NewStatus}.");

            if (newStatus == PurchaseOrderStatus.Pending)
                throw new BusinessException("Cannot reset a processed order back to Pending status.");

            if (purchaseOrder.Status == PurchaseOrderStatus.Cancelled)
                throw new BusinessException("Cannot change the status of an already cancelled order.");

            if (purchaseOrder.Status == PurchaseOrderStatus.Completed && newStatus != PurchaseOrderStatus.Cancelled)
                throw new BusinessException("Completed orders can only be moved to Cancelled status.");

            await _uow.BeginTransactionAsync();

            try
            {
                if (newStatus == PurchaseOrderStatus.Cancelled)
                {
                    await ProcessCancellationAsync(purchaseOrder);
                }
                else if (newStatus == PurchaseOrderStatus.Completed || newStatus == PurchaseOrderStatus.PartiallyReceived)
                {
                    await ProcessCompletionAsync(purchaseOrder, updateDto, newStatus);
                }

                purchaseOrder.Status = newStatus;

                await _uow.CompleteAsync();
                await _uow.CommitAsync();
            }
            catch (Exception)
            {
                await _uow.RollbackAsync();
                throw;
            }
        }
    }
}
