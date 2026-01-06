import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Year } from "./Year";
import { Teacher } from "./Teacher";
import { Question } from "./Question";

@Entity('quiz_quizzes')
export class Quiz {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ nullable: false })
    title!: string;

    @ManyToOne(()=> Year, year => year.quizzes, { nullable: false })
    year!: Year;

    @ManyToOne(()=> Teacher, teacher => teacher.quizzes, { nullable: false })
    teacher!: Teacher;

    @OneToMany(() => Question, question => question.quiz)
    questions!: Question[];

    @CreateDateColumn()
    createdAt!: Date;

}