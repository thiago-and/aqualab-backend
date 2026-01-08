import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Question } from "./Question";
import { Year } from "../school/Year";
import { Teacher } from "../users/Teacher";
import { QuizAttempt } from "./QuizAttempt";

@Entity('quiz_quizzes')
export class Quiz {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ nullable: false })
    title!: string;

    @ManyToOne(() => Year, year => year.quizzes, { nullable: false })
    year!: Year;

    @ManyToOne(() => Teacher, teacher => teacher.quizzes, { nullable: false })
    teacher!: Teacher;

    @OneToMany(() => Question, question => question.quiz, {
        cascade: true,
        onDelete: "CASCADE"
    })
    questions!: Question[];

    @OneToMany(() => QuizAttempt, attempt => attempt.quiz)
    attempts!: QuizAttempt[];

    @CreateDateColumn()
    createdAt!: Date;

}