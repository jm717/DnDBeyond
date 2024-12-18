"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HpModule = void 0;
const character_service_1 = require("../character/character.service");
const hp_service_1 = require("./hp.service");
const hp_controller_1 = require("./hp.controller");
const common_1 = require("@nestjs/common");
let HpModule = class HpModule {
};
exports.HpModule = HpModule;
exports.HpModule = HpModule = __decorate([
    (0, common_1.Module)({
        providers: [hp_service_1.HpService, character_service_1.CharacterService],
        controllers: [hp_controller_1.HpController],
    })
], HpModule);
//# sourceMappingURL=hp.module.js.map