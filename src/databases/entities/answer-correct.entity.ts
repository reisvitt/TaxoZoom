import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { Question } from './question.entity';
import { Answer } from './answer.entity';

@Entity()
export class AnswerCorrect {
  @PrimaryColumn()
  question_id: number;

  @Column()
  answer_id: number;

  @ManyToOne(() => Question)
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @ManyToOne(() => Answer)
  @JoinColumn({ name: 'answer_id' })
  answer: Answer;
}
