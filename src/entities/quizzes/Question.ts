import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Quiz } from "./Quiz";
import { Option } from "./Option";


@Entity('quiz_questions')
export class Question {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ nullable: false })
    statement!: string;

    @ManyToOne(() => Quiz, quiz => quiz.questions, {
        onDelete: "CASCADE",
        nullable: false
    })
    quiz!: Quiz;

    @OneToMany(() => Option, option => option.question, {
        cascade: true
    })
    options!: Option[];
}