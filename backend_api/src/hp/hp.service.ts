import { CharacterService } from 'src/character/character.service';
import { DamageDto } from './dto/damage.dto';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class HpService {
  constructor(private readonly characterService: CharacterService) {}

  async dealDamage(
    characterName: string,
    damageDto: DamageDto,
  ): Promise<number> {
    const character = this.characterService.getCharacter(characterName);

    if (!character) {
      throw new NotFoundException(`Character ${character} not found.`);
    }

    const { damageType } = damageDto;
    let damageDealt = damageDto.damageAmount;

    // Check if character defense has Immunity or Resistance
    if (character.defenses) {
      const defenses = character.defenses.filter(
        (defense) => defense.type.toLowerCase() === damageType.toLowerCase(),
      );

      for (const def of defenses) {
        // @todo Verify if immunity affects tempHPs
        if (def.defense === 'immunity') {
          return -1; // no damage
        } else if (def.defense === 'resistance') {
          damageDealt = damageDealt / 2; // take half damage
        }
      }
    }

    // If character has temporary hit points, deduct from it first
    if (character.tempHitPoints) {
      if (damageDealt >= character.tempHitPoints) {
        damageDealt -= character.tempHitPoints;
        character.tempHitPoints = 0;
      } else {
        character.tempHitPoints -= damageDealt;
        damageDealt = 0;
      }
    }

    // Apply damage to regular hit points
    character.hitPoints -= damageDealt;

    if (character.hitPoints < 0) {
      character.hitPoints = 0;
    }

    await this.characterService.setCharacter(characterName, character);

    return character.hitPoints;
  }

  async healCharacter(
    characterName: string,
    healAmount: number,
  ): Promise<number> {
    const character = this.characterService.getCharacter(characterName);

    if (!character) {
      throw new NotFoundException(`Character ${character} not found.`);
    }

    character.hitPoints = +character.hitPoints + healAmount;
    //character.hitPoints = Number(character.hitPoints) + healAmount;

    await this.characterService.setCharacter(characterName, character);

    return character.hitPoints;
  }

  async addTempHitPoints(
    characterName: string,
    additionalPoints: number,
  ): Promise<number> {
    const character = this.characterService.getCharacter(characterName);

    if (!character) {
      throw new NotFoundException(`Character ${character} not found.`);
    }

    // TempHitPoints are not additive
    if (
      !character.tempHitPoints ||
      character.tempHitPoints < additionalPoints
    ) {
      character.hitPoints = additionalPoints;
    }

    await this.characterService.setCharacter(characterName, character);

    return character.tempHitPoints;
  }
}
