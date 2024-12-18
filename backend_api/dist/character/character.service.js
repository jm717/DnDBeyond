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
exports.CharacterService = void 0;
const common_1 = require("@nestjs/common");
const path = require("path");
const fs_1 = require("fs");
let CharacterService = class CharacterService {
    constructor() {
        this.characterRepository = {};
        this.dataPath = path.resolve(__dirname, '../../data');
    }
    async onModuleInit() {
        try {
            const dataFiles = await fs_1.promises.readdir(this.dataPath);
            for (const file of dataFiles) {
                if (file.endsWith('.json')) {
                    await this.fetchCharacter(file);
                }
            }
        }
        catch (error) {
            console.error('Error loading character data:', error);
        }
    }
    getCharacter(name) {
        return this.characterRepository[name];
    }
    async setCharacter(name, character) {
        this.characterRepository[name] = character;
        await fs_1.promises.writeFile(`${this.dataPath}/${name}.json`, JSON.stringify(character, null, 2));
    }
    async fetchCharacter(name) {
        const data = await fs_1.promises.readFile(`${this.dataPath}/${name}`, 'utf-8');
        const character = JSON.parse(data);
        this.characterRepository[name.replace('.json', '')] = character;
    }
};
exports.CharacterService = CharacterService;
exports.CharacterService = CharacterService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], CharacterService);
//# sourceMappingURL=character.service.js.map