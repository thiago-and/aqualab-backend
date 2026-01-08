import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { QuizAttempt } from "./QuizAttempt";
import { Question } from "./Question";
import { Option } from "./Option";

@Entity("quiz_student_answers")
export class StudentAnswer {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => QuizAttempt, attempt => attempt.answers, {
        nullable: false,
        onDelete: "CASCADE"
    })
    attempt!: QuizAttempt;

    @ManyToOne(() => Question, {
        nullable: false
    })
    question!: Question;

    @ManyToOne(() => Option, {
        nullable: false
    })
    selectedOption!: Option;
}