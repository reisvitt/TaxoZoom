import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Question } from './question.entity';

@Entity()
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'text', default: '' })
  why_incorrect: string;

  @Column({ default: false })
  correct: boolean;

  @ManyToOne(() => Question, (question) => question.answers)
  @JoinColumn()
  question: Question;
}
