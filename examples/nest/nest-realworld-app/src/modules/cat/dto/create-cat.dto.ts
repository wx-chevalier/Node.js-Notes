import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateCatDto {
  @IsString()
  readonly name: string;

  @IsInt()
  @IsOptional()
  readonly age: number;

  @IsString()
  @IsOptional()
  readonly breed: string;
}
