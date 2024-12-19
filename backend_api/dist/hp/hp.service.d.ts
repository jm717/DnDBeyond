import { CharacterService } from '../character/character.service';
import { DamageDto } from './dto/damage.dto';
export declare class HpService {
    private readonly characterService;
    constructor(characterService: CharacterService);
    dealDamage(characterName: string, damageDto: DamageDto): Promise<number>;
    healCharacter(characterName: string, healAmount: number): Promise<number>;
    addTempHitPoints(characterName: string, additionalPoints: number): Promise<number>;
}
