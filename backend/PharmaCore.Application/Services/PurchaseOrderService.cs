

using AutoMapper;
using PharmaCore.Core.DTOs.PurchaseOrder;
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

        public PurchaseOrderService(IUnitOfWork uow, IMapper mapper)
        {
            _uow = uow;
            _mapper = mapper;
        }

        public async Task<PurchaseOrderResponseDto> CreateAsync(CreatePurchaseOrderDto createDto)
        {
            if (!await _uow.Users.ExistsAsync(createDto.UserId))
                throw new BusinessException("User not found");

            if (!await _uow.Suppliers.ExistsAsync(createDto.SupplierId))
                throw new BusinessException("Supplier not found");

            var drugIds = createDto.Items.Select(i => i.DrugId).Distinct().ToList();

            var existingDrugsCount = await _uow.Drugs.CountByIdsAsync(drugIds);
            if (existingDrugsCount != drugIds.Count)
                throw new BusinessException("One or more drugs are invalid or do not exist.");

            var purchaseOrder = _mapper.Map<PurchaseOrder>(createDto);

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

        public async Task UpdateStatusAsync(int id, PurchaseOrderStatus newStatus)
        {
            var purchaseOrder = await _uow.PurchaseOrders.GetByIdAsync(id);

            if (purchaseOrder == null)
                throw new BusinessException($"Purchase Order with ID {id} not found");

            if (newStatus == purchaseOrder.Status)
                throw new BusinessException($"The order is already marked as {newStatus}.");
            

            if (newStatus == PurchaseOrderStatus.Pending)
                throw new BusinessException("Cannot reset a processed order back to Pending status.");

            if (purchaseOrder.Status != PurchaseOrderStatus.Pending)
                throw new BusinessException($"Cannot change the status of an order that is already {purchaseOrder.Status}.");


            purchaseOrder.Status = newStatus;
            await _uow.CompleteAsync();
        }
    }
}
