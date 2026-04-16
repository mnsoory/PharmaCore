using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PharmaCore.Application.Services;
using PharmaCore.Core.DTOs.PurchaseOrder;
using PharmaCore.Core.Enums;
using PharmaCore.Core.Interfaces.Services;

namespace PharmaCore.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PurchaseOrdersController : ControllerBase
    {
        private readonly IPurchaseOrderService _orderService;

        public PurchaseOrdersController(IPurchaseOrderService orderService) => _orderService = orderService;

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<PurchaseOrderResponseDto>>> GetAll()
        {
            var purchaseOrders = await _orderService.GetAllAsync();
            return Ok(purchaseOrders);
        }

        [HttpGet("{id}", Name = "GetPurchaseOrderByIdAsync")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<PurchaseOrderResponseDto>> GetById(int id)
        {
            var purchaseOrder = await _orderService.GetByIdAsync(id);
            return Ok(purchaseOrder);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<PurchaseOrderResponseDto>> Create([FromBody] CreatePurchaseOrderDto createDto)
        {
            var purchaseOrderResponse = await _orderService.CreateAsync(createDto);

            return CreatedAtRoute("GetPurchaseOrderByIdAsync", new {id = purchaseOrderResponse.PurchaseOrderId} ,purchaseOrderResponse);
        }

        [HttpPatch("{id}/status")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> UpdateStatus(int id, [FromBody] PurchaseOrderUpdateStatusDto updateStatusDto)
        {
            await _orderService.UpdateStatusAsync(id, updateStatusDto);
            return NoContent();
        }
    }
}
