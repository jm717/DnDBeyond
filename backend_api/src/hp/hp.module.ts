import { CharacterService } from 'src/character/character.service';
import { HpService } from './hp.service';
import { HpController } from './hp.controller';
import { Module } from '@nestjs/common';

@Module({
  providers: [HpService, CharacterService], // avoid unnecessary modularization
  controllers: [HpController],
})
export class HpModule {}
