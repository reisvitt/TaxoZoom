import { Repository } from 'typeorm';
import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from 'src/databases/entities/question.entity';
import { Answer } from 'src/databases/entities/answer.entity';
import { AnswerCorrect } from 'src/databases/entities/answer-correct.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { InitGameDto } from './dto/init-game.dto';
import { User } from 'src/databases/entities/user.entity';
import { UserAnswer } from 'src/databases/entities/user-answer';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Answer)
    private answerRepository: Repository<Answer>,
    @InjectRepository(AnswerCorrect)
    private correctAnswersRepository: Repository<AnswerCorrect>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserAnswer)
    private userAnswerRepository: Repository<UserAnswer>,
  ) {}

  async initGame(initGameDto: InitGameDto) {
    try {
      const exist = await this.userRepository.findOneBy({
        uuid: initGameDto.uuid,
      });

      if (exist) {
        throw new ConflictException('User already exist');
      }

      const user = this.userRepository.create(initGameDto);
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      throw new HttpException(
        {
          message: error,
        },
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createQuestion(
    createQuestionDto: CreateQuestionDto,
  ): Promise<Question> {
    const { text } = createQuestionDto;
    try {
      const question = this.questionRepository.create({ text: text });

      await this.questionRepository.save(question);

      return question;
    } catch (error) {
      throw new HttpException(
        {
          message: error,
        },
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createAnswer(
    questionId: number,
    createAnswerDto: CreateAnswerDto,
  ): Promise<Answer> {
    const { ...answerDto } = createAnswerDto;
    try {
      const question = await this.findQuestion(questionId);

      // verify if this question already a correct answer
      if (answerDto.correct) {
        const answerCorrect = await this.correctAnswersRepository.findOneBy({
          question_id: question.id,
        });

        if (answerCorrect) {
          throw new ConflictException(
            'This question already has a correct answer',
          );
        }
      }

      const answer = this.answerRepository.create(answerDto);

      answer.question = question;
      await this.answerRepository.save(answer);

      if (answerDto.correct) {
        const answerCorrect = this.correctAnswersRepository.create({
          question_id: question.id,
          answer_id: answer.id,
        });
        await this.correctAnswersRepository.save(answerCorrect);
      }

      return answer;
    } catch (error) {
      throw new HttpException(
        {
          message: error,
        },
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getQuestions(): Promise<Question[]> {
    return this.questionRepository.find({
      relations: { answers: true },
      select: {
        answers: {
          id: true,
          text: true,
        },
      },
      order: {
        answers: {
          id: 'DESC',
        },
      },
    });
  }

  async getQuestionWithAnswers(questionId: number): Promise<Question> {
    return this.questionRepository.findOneOrFail({
      where: { id: questionId },
      relations: { answers: true },
      order: {
        answers: {
          id: 'DESC',
        },
      },
    });
  }

  async checkAnswer(
    uuid: string,
    questionId: number,
    answerId?: number,
  ): Promise<any> {
    try {
      if (!uuid) {
        throw new UnauthorizedException();
      }

      const user = await this.userRepository.findOneBy({ uuid });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      let answer;

      if (answerId) {
        answer = await this.answerRepository.findOneBy({ id: answerId });
        if (!answer) {
          throw new NotFoundException('Answer not found');
        }
      }

      const question = await this.getQuestionWithAnswers(questionId);

      const userAnswer = this.userAnswerRepository.create({
        user,
        answer: answer || null,
        question,
      });

      await this.userAnswerRepository.save(userAnswer);

      const answerCorrect = await this.correctAnswersRepository.findOneBy({
        question_id: questionId,
        answer_id: answerId,
      });

      if (answerCorrect) {
        return {
          message: 'Resposta correta',
          correct: true,
          question,
        };
      } else {
        return {
          message: 'Resposta incorreta.',
          correct: false,
          question,
        };
      }
    } catch (error) {
      throw new HttpException(
        {
          message: error,
        },
        error?.status || HttpStatus.BAD_REQUEST,
      );
    }
    // ... (the previous logic remains the same)
  }

  findQuestion(questionId: number) {
    return this.questionRepository.findOneOrFail({
      where: { id: questionId },
    });
  }

  async score(userUuid: string) {
    const certas = await this.userAnswerRepository.query(`
      SELECT COUNT(ac)  FROM user_answer as ua
      INNER JOIN answer_correct ac ON ac.answer_id = ua."answerId"
      AND ac.question_id = ua."questionId"
      WHERE ua."userUuid" = '${userUuid}';
    `);

    const total = await this.userAnswerRepository.query(`
      SELECT COUNT(ua)  FROM user_answer as ua
      WHERE ua."userUuid" = '${userUuid}';
    `);

    const user = await this.userRepository.findOneByOrFail({ uuid: userUuid });

    return {
      certas: +certas[0].count,
      erradas: total[0].count - certas[0].count,
      total: +total[0].count,
      user,
    };
  }
}
