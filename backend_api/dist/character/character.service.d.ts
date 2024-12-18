import { OnModuleInit } from '@nestjs/common';
import { Character } from './entity/character.entity';
export declare class CharacterService implements OnModuleInit {
    private characterRepository;
    private dataPath;
    constructor();
    onModuleInit(): Promise<void>;
    getCharacter(name: string): Character | undefined;
    setCharacter(name: string, character: Character): Promise<void>;
    fetchCharacter(name: string): Promise<void>;
}
