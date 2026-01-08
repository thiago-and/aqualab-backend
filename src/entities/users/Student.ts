import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Year } from "../school/Year";
import { Teacher } from "./Teacher";
import { QuizAttempt } from "../quizzes/QuizAttempt";

@Entity('students')
export class Student {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ nullable: false })
    name!: string;

    @Column({ name: "enrollment_number", unique: true , nullable: false  })
    enrollmentNumber!: number;

    @ManyToOne(() => Year, year => year.students, { nullable: false })
    year!: Year;
    
    @ManyToOne(() => Teacher, teacher => teacher.students, { nullable: true })
    teacher!: Teacher | null;

    @OneToMany(() => QuizAttempt, attempt => attempt.student)
    quizAttempts!: QuizAttempt[];
}