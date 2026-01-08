import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Question } from "./Question";

@Entity('quiz_options')
export class Option {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ nullable: false })
    text!: string;

    @Column({ name: "is_correct", default: false })
    isCorrect!: boolean;

    @ManyToOne(() => Question, question => question.options, {
        onDelete: "CASCADE",
        nullable: false
    })
    question!: Question;

}