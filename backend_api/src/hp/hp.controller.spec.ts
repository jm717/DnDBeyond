import { Test, TestingModule } from '@nestjs/testing';
import { HpController } from './hp.controller';
import { HpService } from './hp.service';
import { CharacterService } from '../character/character.service';
import { HttpStatus, HttpException } from '@nestjs/common';
import { DamageDto } from './dto/damage.dto';
import { DamageType } from './dto/damage-type.enum';

describe('HpController', () => {
  let controller: HpController;

  const characterName = 'Tanis';
  const healAmount = 15;
  const points = 8;
  const nonExistentCharacter = 'NonExistentCharacter';
  const damageDto: DamageDto = {
    damageAmount: 10,
    damageType: DamageType.POISON,
  };

  const character = {
    name: characterName,
    hitPoints: 100,
    defenses: [],
  };

  const mockHpService = {
    dealDamage: jest.fn(),
    healCharacter: jest.fn(),
    addTempHitPoints: jest.fn(),
  };
  const mockCharacterService = {
    getCharacter: jest.fn(),
    setCharacter: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HpController],
      providers: [
        HpService,
        { provide: CharacterService, useValue: mockCharacterService },
      ],
    })
      .overrideProvider(HpService)
      .useValue(mockHpService)
      .compile();

    controller = module.get<HpController>(HpController);

    jest.resetAllMocks();
  });

  describe('getCharacterHp', () => {
    it('should return character hit points if character exists', () => {
      mockCharacterService.getCharacter.mockReturnValue(character);

      const res = controller.getCharacterHp(characterName);

      expect(res.statusCode).toBe(HttpStatus.OK);
      expect(res.message).toBe(
        `${character.name} has ${character.hitPoints} hit points.`,
      );
    });

    it('should return NOT_FOUND exception if character does NOT exists', () => {
      mockCharacterService.getCharacter.mockReturnValue(undefined);

      expect(() => controller.getCharacterHp(nonExistentCharacter)).toThrow(
        new HttpException('Character not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('dealDamage', () => {
    it('should successfully deal damage of given amount to given character', async () => {
      mockHpService.dealDamage.mockResolvedValue(100);
      mockCharacterService.getCharacter.mockReturnValue(character);

      const res = await controller.dealDamage(characterName, damageDto);

      expect(res.statusCode).toBe(HttpStatus.OK);
      expect(res.message).toBe(
        `Successfully dealt damage ${damageDto.damageAmount} to ${character.name}, new hit points 100.`,
      );
      expect(res.body).toEqual(character);
    });

    it('should not deal damage if the character is immune to the damage type', async () => {
      const mockCharacterWithImmunity = {
        name: characterName,
        hitPoints: 100,
        defenses: [{ type: 'poison', defense: 'immunity' }],
      };

      mockHpService.dealDamage.mockResolvedValue(-1);
      mockCharacterService.getCharacter.mockReturnValue(
        mockCharacterWithImmunity,
      );

      const res = await controller.dealDamage(characterName, damageDto);

      expect(res.statusCode).toBe(HttpStatus.OK);
      expect(res.message).toBe(
        `No damage dealt! ${mockCharacterWithImmunity.name} is immune to ${damageDto.damageType}.`,
      );
      expect(res.body).toEqual(mockCharacterWithImmunity);
    });

    it('should return an error response if dealDamage fails', async () => {
      mockHpService.dealDamage.mockRejectedValue(
        new HttpException('Character not found', HttpStatus.NOT_FOUND),
      );

      const res = await controller.dealDamage(characterName, damageDto);

      expect(res.statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(res.message).toContain(
        'Failed to deal damage. Err: Character not found',
      );
    });

    it('should return an internal server error for unexpected exceptions', async () => {
      mockHpService.dealDamage.mockRejectedValue(new Error('Unexpected error'));

      const res = await controller.dealDamage(characterName, damageDto);

      expect(res.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.message).toContain(
        'Failed to deal damage. Err: Unexpected error',
      );
    });
  });

  describe('heal', () => {
    it('should successfully heal character and increase hit points', async () => {
      mockHpService.healCharacter.mockResolvedValue(115);

      const res = await controller.heal(characterName, { healAmount });

      expect(mockHpService.healCharacter).toHaveBeenCalledWith(
        characterName,
        healAmount,
      );
      expect(res.statusCode).toBe(HttpStatus.OK);
      expect(res.message).toBe(
        `Successfully healed character ${characterName}, new hit points 115.`,
      );
    });

    it('should return NOT_FOUND exception if character does NOT exists', async () => {
      mockHpService.healCharacter.mockRejectedValue(
        new HttpException('Character not found', HttpStatus.NOT_FOUND),
      );

      const res = await controller.heal(nonExistentCharacter, { healAmount });

      expect(mockHpService.healCharacter).toHaveBeenCalledWith(
        nonExistentCharacter,
        healAmount,
      );
      expect(res.statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(res.message).toContain(
        'Failed to heal character. Err: Character not found',
      );
    });

    it('should return INTERNAL_SERVER_ERROR for unexpected exceptions', async () => {
      mockHpService.healCharacter.mockRejectedValue(
        new Error('Unexpected error'),
      );

      const res = await controller.heal(characterName, { healAmount });

      expect(mockHpService.healCharacter).toHaveBeenCalledWith(
        characterName,
        healAmount,
      );
      expect(res.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.message).toContain(
        'Failed to heal character. Err: Unexpected error',
      );
    });
  });

  describe('addTempHitPoints', () => {
    it('should successfully add temporary hit points to character', async () => {
      mockHpService.addTempHitPoints.mockResolvedValue(8);

      const res = await controller.addTempHitPoints(characterName, { points });

      expect(mockHpService.addTempHitPoints).toHaveBeenCalledWith(
        characterName,
        points,
      );
      expect(mockHpService.addTempHitPoints).toHaveBeenCalledTimes(1);
      expect(res.statusCode).toBe(HttpStatus.OK);
      expect(res.message).toBe(
        `Successfully added temporary hit points to character ${characterName}, new temporary hit points 8.`,
      );
    });

    it('return NOT_FOUND exception if character does NOT exists', async () => {
      mockHpService.addTempHitPoints.mockRejectedValue(
        new HttpException('Character not found', HttpStatus.NOT_FOUND),
      );

      const res = await controller.addTempHitPoints(nonExistentCharacter, {
        points,
      });

      expect(mockHpService.addTempHitPoints).toHaveBeenCalledWith(
        nonExistentCharacter,
        points,
      );
      expect(res.statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(res.message).toContain(
        'Failed to add temporary hit points. Err: Character not found',
      );
    });
  });
});
