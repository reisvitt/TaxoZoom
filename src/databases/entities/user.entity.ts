import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { UserAnswer } from './user-answer';

@Entity()
export class User {
  @PrimaryColumn('uuid', { unique: true })
  uuid: string;

  @Column()
  name: string;

  @OneToMany(() => UserAnswer, (userAnswer) => userAnswer.user)
  answers: UserAnswer[];
}
