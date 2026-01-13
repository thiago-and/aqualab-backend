import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { Student } from "../users/Student";
import { Quiz } from "./Quiz";
import { StudentAnswer } from "./StudentAnswer";

export enum QuizAttemptStatus {
  IN_PROGRESS = "IN_PROGRESS",
  FINISHED = "FINISHED"
}

@Entity("quiz_attempts")
@Unique(["student", "quiz"])
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

  @Column({ name: "answers", type: "json", nullable: true })
  answersPayload?: Array<{
    questionId: string;
    optionId: string;
    isCorrect: boolean;
  }>;

  @Column({
    type: "enum",
    enum: QuizAttemptStatus,
    default: QuizAttemptStatus.IN_PROGRESS
  })
  status!: QuizAttemptStatus;

  @Column({ length: 255, nullable: true })
  quizTitle?: string;

  @Column({ type: "float", default: 0 })
  score!: number;

  @Column({ type: "int", default: 100 })
  totalPoints!: number;

  @Column({ type: "int", default: 0 })
  totalQuestions!: number;

  @Column({ type: "int", default: 0 })
  correctAnswers!: number;

  @Column({ type: "int", default: 0 })
  incorrectAnswers!: number;

  @Column({ type: "float", default: 0 })
  percentage!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: "datetime", nullable: true })
  submittedAt?: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

