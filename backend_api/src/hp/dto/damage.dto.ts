import { DamageType } from './damage-type.enum';
import { IsEnum, IsNumber, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DamageDto {
  @ApiProperty({ enum: DamageType, required: true })
  @IsNotEmpty()
  @IsEnum(DamageType, { message: 'Invalid damage type.' })
  readonly damageType: DamageType;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber({}, { message: 'Damage amount must be a number.' })
  @Min(1, { message: 'Damage amount must be greater than 0.' })
  readonly damageAmount: number;
}
