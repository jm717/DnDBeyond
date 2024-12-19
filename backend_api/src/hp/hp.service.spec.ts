import { Test, TestingModule } from '@nestjs/testing';
import { HpService } from './hp.service';
import { CharacterService } from '../character/character.service';
import { DamageDto } from './dto/damage.dto';
import { DamageType } from './dto/damage-type.enum';
import { NotFoundException } from '@nestjs/common';

describe('HpService', () => {
  let service: HpService;

  const nonExistentCharacter = 'NonExistentCharacter';
  const damageDto: DamageDto = {
    damageAmount: 10,
    damageType: DamageType.POISON,
  };
  const healAmount = 15;
  const additionalPoints = 50;

  const mockCharacter = {
    name: 'Tanis',
    hitPoints: 50,
  };

  const mockCharacterService = {
    getCharacter: jest.fn(),
    setCharacter: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HpService,
        { provide: CharacterService, useValue: mockCharacterService },
      ],
    }).compile();

    service = module.get<HpService>(HpService);

    jest.clearAllMocks();
  });

  describe('dealDamage', () => {
    // it('should deal damage to character hit points', async () => {

    // });
    it('should throw NotFoundException if character does not exist', async () => {
      mockCharacterService.getCharacter.mockReturnValue(undefined);

      await expect(
        service.dealDamage(nonExistentCharacter, damageDto),
      ).rejects.toThrow(NotFoundException);

      expect(mockCharacterService.getCharacter).toHaveBeenCalledTimes(1);
      expect(mockCharacterService.getCharacter).toHaveBeenCalledWith(
        nonExistentCharacter,
      );
    });

    it('should return -1 if character has immunity to damage type', async () => {
      const character = {
        hitPoints: 100,
        defenses: [{ type: 'poison', defense: 'immunity' }],
      };

      mockCharacterService.getCharacter.mockReturnValue(character);

      const res = await service.dealDamage('ImmuneCharacter', damageDto);

      expect(mockCharacterService.getCharacter).toHaveBeenCalledTimes(1);
      expect(res).toBe(-1);
      expect(character.hitPoints).toBe(100);
      expect(mockCharacterService.setCharacter).not.toHaveBeenCalled();
    });

    it('should deal half the damage if character has resistance to damage type', async () => {
      const character = {
        hitPoints: 100,
        defenses: [{ type: 'poison', defense: 'resistance' }],
      };

      mockCharacterService.getCharacter.mockReturnValue(character);

      const res = await service.dealDamage('ResistanceCharacter', damageDto);

      expect(mockCharacterService.getCharacter).toHaveBeenCalledTimes(1);
      expect(res).toBe(95);
      expect(character.hitPoints).toBe(95);
      expect(mockCharacterService.setCharacter).toHaveBeenCalledTimes(1);
    });

    it('should deal damage to temporary hit points if exists, then hit points', async () => {
      const character = {
        hitPoints: 100,
        tempHitPoints: 5,
        defenses: [],
      };
      mockCharacterService.getCharacter.mockReturnValue(character);

      const res = await service.dealDamage('CharacterWithTempHP', damageDto);

      expect(mockCharacterService.getCharacter).toHaveBeenCalledTimes(1);
      expect(res).toBe(95);
      expect(character.tempHitPoints).toBe(0);
      expect(mockCharacterService.setCharacter).toHaveBeenCalledWith(
        'CharacterWithTempHP',
        character,
      );
    });

    it('should set character hit points to zero if damage amount exceeds its value', async () => {
      const character = {
        hitPoints: 4,
        tempHitPoints: 5,
        defenses: [],
      };
      mockCharacterService.getCharacter.mockReturnValue(character);

      const res = await service.dealDamage('CharacterWithLowHP', damageDto);

      expect(mockCharacterService.getCharacter).toHaveBeenCalledTimes(1);
      expect(res).toBe(0);
      expect(character.hitPoints).toBe(0);
      expect(character.tempHitPoints).toBe(0);
      expect(mockCharacterService.setCharacter).toHaveBeenCalledWith(
        'CharacterWithLowHP',
        character,
      );
    });
  });

  describe('healCharacter', () => {
    it('should increase characters hit points', async () => {
      mockCharacterService.getCharacter.mockReturnValue(mockCharacter);

      const newHitPoints = await service.healCharacter(
        mockCharacter.name,
        healAmount,
      );

      expect(mockCharacterService.getCharacter).toHaveBeenCalledTimes(1);
      expect(mockCharacterService.getCharacter).toHaveBeenCalledWith(
        mockCharacter.name,
      );
      expect(newHitPoints).toBe(50 + healAmount); // 50 + 15

      expect(mockCharacterService.setCharacter).toHaveBeenCalledTimes(1);
      expect(mockCharacterService.setCharacter).toHaveBeenCalledWith(
        mockCharacter.name,
        {
          ...mockCharacter,
          hitPoints: 50 + healAmount,
        },
      );
    });

    it('should throw NotFoundException if character does not exist', async () => {
      mockCharacterService.getCharacter.mockReturnValue(undefined);

      await expect(
        service.healCharacter(mockCharacter.name, healAmount),
      ).rejects.toThrow(NotFoundException);

      expect(mockCharacterService.getCharacter).toHaveBeenCalledTimes(1);
      expect(mockCharacterService.getCharacter).toHaveBeenCalledWith(
        mockCharacter.name,
      );
      expect(mockCharacterService.setCharacter).not.toHaveBeenCalled();
    });
  }); // add validation via DTO to handle 0 or negative heal amount input

  describe('addTempHitPoints', () => {
    it('should set tempHitPoints if not set or if additional points value higher than current temp hitPoints', async () => {
      mockCharacterService.getCharacter.mockReturnValue(mockCharacter); // no temp points set

      const res = await service.addTempHitPoints(
        mockCharacter.name,
        additionalPoints,
      );

      expect(res).toBe(additionalPoints);
      expect(mockCharacterService.getCharacter).toHaveBeenCalledTimes(1);
      expect(mockCharacterService.getCharacter).toHaveBeenCalledWith(
        mockCharacter.name,
      );
      expect(mockCharacterService.setCharacter).toHaveBeenCalledWith(
        mockCharacter.name,
        {
          ...mockCharacter,
          tempHitPoints: additionalPoints,
        },
      );
    });

    it('should throw NotFoundException if character does NOT exist', async () => {
      mockCharacterService.getCharacter.mockReturnValue(undefined);

      await expect(
        service.addTempHitPoints(mockCharacter.name, additionalPoints),
      ).rejects.toThrow(NotFoundException);

      expect(mockCharacterService.getCharacter).toHaveBeenCalledTimes(1);
      expect(mockCharacterService.getCharacter).toHaveBeenCalledWith(
        mockCharacter.name,
      );
      expect(mockCharacterService.setCharacter).not.toHaveBeenCalled();
    });

    it('should not change tempHitPoints if they are higher than additional points', async () => {
      const character = {
        name: 'Tanis',
        hitPoints: 50,
        tempHitPoints: 60,
      };

      mockCharacterService.getCharacter.mockReturnValue(character);

      const res = await service.addTempHitPoints(
        character.name,
        additionalPoints,
      );

      expect(mockCharacterService.getCharacter).toHaveBeenCalledWith(
        character.name,
      );
      expect(mockCharacterService.setCharacter).not.toHaveBeenCalled();
      expect(res).toBe(character.tempHitPoints);
    });
  });
});
