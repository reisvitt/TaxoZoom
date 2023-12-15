import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class InitGameDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID(`4`)
  readonly uuid: string;
}
