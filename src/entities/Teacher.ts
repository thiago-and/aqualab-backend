import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Year } from "./Year";
import { Student } from "./Student";

@Entity('teachers')
export class Teacher {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ nullable: false })
    name!: string;

    @Column({ name: "enrollment_number", unique: true, nullable: false })
    enrollmentNumber!: number;

    @Column({ unique: true , nullable: false })
    email!: string;

    @Column({ nullable: false })
    password!: string;

    @OneToMany(() => Year, year => year.teacher)
    years!: Year[];

    @OneToMany(() => Student, student => student.teacher)
    students!: Student[];

}