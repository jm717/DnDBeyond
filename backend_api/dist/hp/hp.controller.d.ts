import { CharacterService } from 'src/character/character.service';
import { HpResponseDto } from './dto/HpResponse.dto';
import { HpService } from './hp.service';
import { DamageDto } from './dto/damage.dto';
export declare class HpController {
    private readonly hpService;
    private readonly characterService;
    constructor(hpService: HpService, characterService: CharacterService);
    getCharacterHp(name: string): HpResponseDto;
    dealDamage(name: string, damageDto: DamageDto): Promise<HpResponseDto>;
    heal(name: string, body: {
        healAmount: number;
    }): Promise<HpResponseDto>;
    addTempHitPoints(name: string, body: {
        points: number;
    }): Promise<HpResponseDto>;
}
