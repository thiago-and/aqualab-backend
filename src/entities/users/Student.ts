import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Year } from "../school/Year";
import { Teacher } from "./Teacher";

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
}