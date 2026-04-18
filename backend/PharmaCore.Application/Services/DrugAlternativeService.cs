

using AutoMapper;
using PharmaCore.Core.DTOs.DrugAlternative;
using PharmaCore.Core.Entities;
using PharmaCore.Core.Exceptions;
using PharmaCore.Core.Interfaces;
using PharmaCore.Core.Interfaces.Services;

namespace PharmaCore.Application.Services
{
    public class DrugAlternativeService : IDrugAlternativeService
    {
        private readonly IUnitOfWork _uow;

        public DrugAlternativeService(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public async Task AddAlternativeAsync(CreateDrugAlternativeDto dto)
        {
            if (dto.DrugId == dto.AlternativeDrugId)
                throw new BusinessException("A drug cannot be an alternative to itself.");

            var drugExists = await _uow.Drugs.ExistsAsync(dto.DrugId);
            var altDrugExists = await _uow.Drugs.ExistsAsync(dto.AlternativeDrugId);

            if (!drugExists || !altDrugExists)
                throw new BusinessException("One or both drugs do not exist.");

            if (await _uow.DrugAlternatives.ExistsAsync(dto.DrugId, dto.AlternativeDrugId))
                throw new BusinessException("This alternative relationship already exists.");

            var alternative = new DrugAlternative
            {
                DrugId = Math.Min(dto.DrugId, dto.AlternativeDrugId),
                AlternativeDrugId = Math.Max(dto.DrugId, dto.AlternativeDrugId)
            };

            await _uow.DrugAlternatives.AddAsync(alternative);
            await _uow.CompleteAsync();
        }

        public async Task RemoveAlternativeAsync(int id1, int id2)
        {
            if (!await _uow.DrugAlternatives.ExistsAsync(id1, id2))
                throw new BusinessException("The specified alternative relationship does not exist.");
            await _uow.DrugAlternatives.DeleteAsync(id1, id2);
            await _uow.CompleteAsync();
        }

        public async Task<DrugAlternativeResponseDto> GetAlternativesAsync(int drugId)
        {
            var drug = await _uow.Drugs.GetByIdAsync(drugId);
            if (drug == null)
                throw new NotFoundException($"Drug with ID {drugId} was not found.");

            var relations = await _uow.DrugAlternatives.GetByDrugIdAsync(drugId);

            return new DrugAlternativeResponseDto
            {
                DrugId = drug.DrugId,
                TradeName = drug.TradeName,
                ScientificName = drug.GenericName,
                Alternatives = relations.Select(da =>
                {
                    var alt = da.DrugId == drugId ? da.AlternativeDrug : da.Drug;
                    return new AlternativeItemDto
                    {
                        Id = alt.DrugId,
                        TradeName = alt.TradeName,
                        GenericName = alt.GenericName
                    };
                }).ToList()
            };
        }
    }
}
