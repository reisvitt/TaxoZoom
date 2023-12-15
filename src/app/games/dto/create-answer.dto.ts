import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateAnswerDto {
  @IsNotEmpty()
  @IsString()
  readonly text: string;

  @IsString()
  readonly why_incorrect: string;

  @IsBoolean()
  readonly correct: boolean;
}
