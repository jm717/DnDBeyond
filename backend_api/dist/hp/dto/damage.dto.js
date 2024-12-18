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
exports.DamageDto = void 0;
const damage_type_enum_1 = require("./damage-type.enum");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class DamageDto {
}
exports.DamageDto = DamageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: damage_type_enum_1.DamageType, required: true }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(damage_type_enum_1.DamageType, { message: 'Invalid damage type.' }),
    __metadata("design:type", String)
], DamageDto.prototype, "damageType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: true }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Damage amount must be a number.' }),
    (0, class_validator_1.Min)(1, { message: 'Damage amount must be greater than 0.' }),
    __metadata("design:type", Number)
], DamageDto.prototype, "damageAmount", void 0);
//# sourceMappingURL=damage.dto.js.map