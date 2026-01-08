import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Student } from "../users/Student";
import { Quiz } from "./Quiz";
import { StudentAnswer } from "./StudentAnswer";

export enum QuizAttemptStatus {
  IN_PROGRESS = "IN_PROGRESS",
  FINISHED = "FINISHED"
}

@Entity("quiz_attempts")
export class QuizAttempt {

  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Student, student => student.quizAttempts, {
    nullable: false
  })
  student!: Student;

  @ManyToOne(() => Quiz, quiz => quiz.attempts, {
    nullable: false
  })
  quiz!: Quiz;

  @OneToMany(() => StudentAnswer, answer => answer.attempt, {
    cascade: true
  })
  answers!: StudentAnswer[];

  @Column({
    type: "enum",
    enum: QuizAttemptStatus,
    default: QuizAttemptStatus.IN_PROGRESS
  })
  status!: QuizAttemptStatus;

  @Column({ type: "float", default: 0 })
  score!: number;

  @CreateDateColumn()
  createdAt!: Date;
}

