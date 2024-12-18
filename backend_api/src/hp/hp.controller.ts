import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CharacterService } from 'src/character/character.service';
import { HpResponseDto } from './dto/HpResponse.dto';
import { HpService } from './hp.service';
import { DamageDto } from './dto/damage.dto';
import { ApiParam, ApiOperation } from '@nestjs/swagger';

@Controller('hp')
export class HpController {
  constructor(
    private readonly hpService: HpService,
    private readonly characterService: CharacterService,
  ) {}

  @ApiOperation({ summary: `Gets Character's Hit Points` })
  @ApiParam({ name: 'name', required: true })
  @Get(':name')
  getCharacterHp(@Param('name') name: string): HpResponseDto {
    const character = this.characterService.getCharacter(name);

    if (!character) {
      throw new HttpException('Character not found', HttpStatus.NOT_FOUND);
    }

    return {
      statusCode: HttpStatus.OK,
      message: `${name} has ${character.hitPoints} hit points.`,
    };
  }

  @ApiOperation({ summary: 'Deals damage to a character' })
  @ApiParam({ name: 'name', required: true })
  @Post(':name/deal-damage')
  async dealDamage(
    @Param('name') name: string,
    @Body() damageDto: DamageDto,
  ): Promise<HpResponseDto> {
    try {
      const updatedHitPoints = await this.hpService.dealDamage(name, damageDto);
      const message =
        updatedHitPoints < 0
          ? `No damage dealt! ${name} is immune to ${damageDto.damageType}.`
          : `Successfully dealt damage ${damageDto.damageAmount} to ${name}, new hit points ${updatedHitPoints}.`;

      const character = this.characterService.getCharacter(name);

      return {
        statusCode: HttpStatus.OK,
        message: message,
        body: character,
      };
    } catch (err) {
      return {
        statusCode:
          err instanceof HttpException
            ? err.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to deal damage. Err: ' + err.message,
      };
    }
  }

  @ApiOperation({ summary: `Increases character's hit points` })
  @ApiParam({ name: 'name', required: true })
  @Post(':name/heal')
  async heal(
    @Param('name') name: string,
    @Body() body: { healAmount: number },
  ): Promise<HpResponseDto> {
    try {
      const updatedHitPoints = await this.hpService.healCharacter(
        name,
        body.healAmount,
      );

      return {
        statusCode: HttpStatus.OK,
        message: `Successfully healed character ${name}, new hit points ${updatedHitPoints}.`,
      };
    } catch (err) {
      return {
        statusCode:
          err instanceof HttpException
            ? err.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to heal character. Err: ' + err.message,
      };
    }
  }

  @ApiOperation({ summary: `Increases character's Temporary hit points` })
  @ApiParam({ name: 'name', required: true })
  @Post(':name/add/temp-hit-points')
  async addTempHitPoints(
    @Param('name') name: string,
    @Body() body: { points: number },
  ): Promise<HpResponseDto> {
    try {
      const updatedHitPoints = await this.hpService.addTempHitPoints(
        name,
        body.points,
      );

      return {
        statusCode: HttpStatus.OK,
        message: `Successfully added temporary hit points to character ${name}, new temporary hit points ${updatedHitPoints}.`,
      };
    } catch (err) {
      return {
        statusCode:
          err instanceof HttpException
            ? err.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Failed to add temporary hit points. Err: ` + err.message,
      };
    }
  }
}
