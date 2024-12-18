"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HpService = void 0;
const character_service_1 = require("../character/character.service");
const common_1 = require("@nestjs/common");
let HpService = class HpService {
    constructor(characterService) {
        this.characterService = characterService;
    }
    async dealDamage(characterName, damageDto) {
        const character = this.characterService.getCharacter(characterName);
        if (!character) {
            throw new common_1.NotFoundException(`Character ${character} not found.`);
        }
        const { damageType } = damageDto;
        let damageDealt = damageDto.damageAmount;
        if (character.defenses) {
            const defenses = character.defenses.filter((defense) => defense.type.toLowerCase() === damageType.toLowerCase());
            for (const def of defenses) {
                if (def.defense === 'immunity') {
                    return -1;
                }
                else if (def.defense === 'resistance') {
                    damageDealt = damageDealt / 2;
                }
            }
        }
        if (character.tempHitPoints) {
            if (damageDealt >= character.tempHitPoints) {
                damageDealt -= character.tempHitPoints;
                character.tempHitPoints = 0;
            }
            else {
                character.tempHitPoints -= damageDealt;
                damageDealt = 0;
            }
        }
        character.hitPoints -= damageDealt;
        if (character.hitPoints < 0) {
            character.hitPoints = 0;
        }
        await this.characterService.setCharacter(characterName, character);
        return character.hitPoints;
    }
    async healCharacter(characterName, healAmount) {
        const character = this.characterService.getCharacter(characterName);
        if (!character) {
            throw new common_1.NotFoundException(`Character ${character} not found.`);
        }
        character.hitPoints = +character.hitPoints + healAmount;
        await this.characterService.setCharacter(characterName, character);
        return character.hitPoints;
    }
    async addTempHitPoints(characterName, additionalPoints) {
        const character = this.characterService.getCharacter(characterName);
        if (!character) {
            throw new common_1.NotFoundException(`Character ${character} not found.`);
        }
        if (!character.tempHitPoints ||
            character.tempHitPoints < additionalPoints) {
            character.hitPoints = additionalPoints;
        }
        await this.characterService.setCharacter(characterName, character);
        return character.tempHitPoints;
    }
};
exports.HpService = HpService;
exports.HpService = HpService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [character_service_1.CharacterService])
], HpService);
//# sourceMappingURL=hp.service.js.map