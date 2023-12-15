import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Answer } from './entities/answer.entity';
import { Question } from './entities/question.entity';
import { AnswerCorrect } from './entities/answer-correct.entity';
import { User } from './entities/user.entity';
import { UserAnswer } from './entities/user-answer';

export default <TypeOrmModuleAsyncOptions>{
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => {
    return <PostgresConnectionOptions>{
      type: 'postgres',
      host: configService.get('DB_HOST'),
      port: +configService.get('DB_PORT'),
      username: configService.get('DB_USER'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_NAME'),
      entities: [Answer, Question, AnswerCorrect, User, UserAnswer],
      synchronize: configService.get('NODE_ENV') === 'DEV',
      ssl: true,
      dialectOptions: {
        ssl: { require: true, rejectUnauthorized: false },
      },
    };
  },
};
