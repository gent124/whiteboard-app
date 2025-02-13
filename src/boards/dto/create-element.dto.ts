import { IsString, IsNumber, IsObject, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export type ElementType =
  | 'DRAWING'
  | 'SHAPE'
  | 'TEXT'
  | 'STICKY_NOTE'
  | 'IMAGE'
  | 'LINK';

export class ElementContentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  text?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  url?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  data?: Record<string, any>;
}

export class PositionDto {
  @ApiProperty()
  @IsNumber()
  x: number;

  @ApiProperty()
  @IsNumber()
  y: number;
}

export class StyleDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  backgroundColor?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fontSize?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fontFamily?: string;
}

export class CreateElementDto {
  @ApiProperty({
    enum: ['DRAWING', 'SHAPE', 'TEXT', 'STICKY_NOTE', 'IMAGE', 'LINK'],
    description: 'The type of element to create',
  })
  @IsString()
  type: ElementType;

  @ApiProperty()
  @IsObject()
  content: ElementContentDto;

  @ApiProperty()
  @IsObject()
  position: PositionDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  style?: StyleDto;
}
