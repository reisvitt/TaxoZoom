import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GameController } from './games.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from 'src/databases/entities/question.entity';
import { Answer } from 'src/databases/entities/answer.entity';
import { AnswerCorrect } from 'src/databases/entities/answer-correct.entity';
import { User } from 'src/databases/entities/user.entity';
import { UserAnswer } from 'src/databases/entities/user-answer';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Question,
      Answer,
      AnswerCorrect,
      User,
      UserAnswer,
    ]),
  ],
  controllers: [GameController],
  providers: [GamesService],
})
export class GamesModule {}
