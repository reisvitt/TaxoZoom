import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Answer } from './answer.entity';
import { Question } from './question.entity';

@Entity()
export class UserAnswer {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => User, (user) => user.answers, { cascade: true })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Answer)
  @JoinColumn()
  answer: Answer;

  @ManyToOne(() => Question)
  @JoinColumn()
  question: Question;
}
