import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  ParseIntPipe,
} from '@nestjs/common';
import { Question } from 'src/databases/entities/question.entity';
import { Answer } from 'src/databases/entities/answer.entity';
import { GamesService } from './games.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { InitGameDto } from './dto/init-game.dto';
import { CurrentUserUuid } from 'src/decorators/uuid.decorator';

@Controller('game')
export class GameController {
  constructor(private gameService: GamesService) {}

  @Post('admin/question')
  async createQuestion(@Body() question: CreateQuestionDto): Promise<Question> {
    return this.gameService.createQuestion(question);
  }

  @Post('admin/answer/:questionId')
  async createAnswer(
    @Param('questionId') questionId: number,
    @Body() answer: CreateAnswerDto,
  ): Promise<Answer> {
    return this.gameService.createAnswer(questionId, answer);
  }

  @Post('/init')
  async initGame(@Body() initGame: InitGameDto) {
    return this.gameService.initGame(initGame);
  }

  @Get('questions')
  async getQuestions(): Promise<Question[]> {
    return this.gameService.getQuestions();
  }

  @Get('question/:questionId')
  async getQuestion(
    @Param('questionId') questionId: number,
  ): Promise<Question> {
    return this.gameService.findQuestion(questionId);
  }

  @Post('respond/:questionId')
  async respondToQuestion(
    @Param('questionId', ParseIntPipe) questionId: number,
    @CurrentUserUuid() uuid: string,
    @Body('answerId') answerId?: number,
  ): Promise<any> {
    return this.gameService.checkAnswer(uuid, questionId, answerId);
  }

  @Get('my-score')
  async myScore(@CurrentUserUuid() uuid: string): Promise<any> {
    return this.gameService.score(uuid);
  }
}
