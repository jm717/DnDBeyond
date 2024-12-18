import { Injectable, OnModuleInit } from '@nestjs/common';
import { Character } from './entity/character.entity';
import * as path from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class CharacterService implements OnModuleInit {
  private characterRepository: Record<string, Character> = {};
  private dataPath: string;

  constructor() {
    this.dataPath = path.resolve(__dirname, '../../data');
  }

  // Initialize data on load
  async onModuleInit(): Promise<void> {
    try {
      const dataFiles = await fs.readdir(this.dataPath);

      for (const file of dataFiles) {
        if (file.endsWith('.json')) {
          await this.fetchCharacter(file);
        }
      }
    } catch (error) {
      console.error('Error loading character data:', error);
    }
  }

  // Helper functions

  getCharacter(name: string): Character | undefined {
    return this.characterRepository[name];
  }

  async setCharacter(name: string, character: Character): Promise<void> {
    this.characterRepository[name] = character;
    await fs.writeFile(
      `${this.dataPath}/${name}.json`,
      JSON.stringify(character, null, 2),
    );
  }

  async fetchCharacter(name: string): Promise<void> {
    const data = await fs.readFile(`${this.dataPath}/${name}`, 'utf-8');
    const character: Character = JSON.parse(data);
    this.characterRepository[name.replace('.json', '')] = character;
  }
}
