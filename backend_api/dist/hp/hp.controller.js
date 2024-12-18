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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HpController = void 0;
const common_1 = require("@nestjs/common");
const character_service_1 = require("../character/character.service");
const HpResponse_dto_1 = require("./dto/HpResponse.dto");
const hp_service_1 = require("./hp.service");
const damage_dto_1 = require("./dto/damage.dto");
const swagger_1 = require("@nestjs/swagger");
let HpController = class HpController {
    constructor(hpService, characterService) {
        this.hpService = hpService;
        this.characterService = characterService;
    }
    getCharacterHp(name) {
        const character = this.characterService.getCharacter(name);
        if (!character) {
            throw new common_1.HttpException('Character not found', common_1.HttpStatus.NOT_FOUND);
        }
        return {
            statusCode: common_1.HttpStatus.OK,
            message: `${name} has ${character.hitPoints} hit points.`,
        };
    }
    async dealDamage(name, damageDto) {
        try {
            const updatedHitPoints = await this.hpService.dealDamage(name, damageDto);
            const message = updatedHitPoints < 0
                ? `No damage dealt! ${name} is immune to ${damageDto.damageType}.`
                : `Successfully dealt damage ${damageDto.damageAmount} to ${name}, new hit points ${updatedHitPoints}.`;
            const character = this.characterService.getCharacter(name);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: message,
                body: character,
            };
        }
        catch (err) {
            return {
                statusCode: err instanceof common_1.HttpException
                    ? err.getStatus()
                    : common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to deal damage. Err: ' + err.message,
            };
        }
    }
    async heal(name, body) {
        try {
            const updatedHitPoints = await this.hpService.healCharacter(name, body.healAmount);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: `Successfully healed character ${name}, new hit points ${updatedHitPoints}.`,
            };
        }
        catch (err) {
            return {
                statusCode: err instanceof common_1.HttpException
                    ? err.getStatus()
                    : common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to heal character. Err: ' + err.message,
            };
        }
    }
    async addTempHitPoints(name, body) {
        try {
            const updatedHitPoints = await this.hpService.addTempHitPoints(name, body.points);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: `Successfully added temporary hit points to character ${name}, new temporary hit points ${updatedHitPoints}.`,
            };
        }
        catch (err) {
            return {
                statusCode: err instanceof common_1.HttpException
                    ? err.getStatus()
                    : common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: `Failed to add temporary hit points. Err: ` + err.message,
            };
        }
    }
};
exports.HpController = HpController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Gets Character's Hit Points` }),
    (0, swagger_1.ApiParam)({ name: 'name', required: true }),
    (0, common_1.Get)(':name'),
    __param(0, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", HpResponse_dto_1.HpResponseDto)
], HpController.prototype, "getCharacterHp", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Deals damage to a character' }),
    (0, swagger_1.ApiParam)({ name: 'name', required: true }),
    (0, common_1.Post)(':name/deal-damage'),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, damage_dto_1.DamageDto]),
    __metadata("design:returntype", Promise)
], HpController.prototype, "dealDamage", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Increases character's hit points` }),
    (0, swagger_1.ApiParam)({ name: 'name', required: true }),
    (0, common_1.Post)(':name/heal'),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], HpController.prototype, "heal", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: `Increases character's Temporary hit points` }),
    (0, swagger_1.ApiParam)({ name: 'name', required: true }),
    (0, common_1.Post)(':name/add/temp-hit-points'),
    __param(0, (0, common_1.Param)('name')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], HpController.prototype, "addTempHitPoints", null);
exports.HpController = HpController = __decorate([
    (0, common_1.Controller)('hp'),
    __metadata("design:paramtypes", [hp_service_1.HpService,
        character_service_1.CharacterService])
], HpController);
//# sourceMappingURL=hp.controller.js.map