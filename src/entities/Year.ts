import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Teacher } from "./Teacher";
import { Student } from "./Student";

@Entity('years')
export class Year {

    @PrimaryGeneratedColumn("uuid")
    id!: string;

    // numero da serie
    @Column({ nullable: false })
    year!: number;

    @ManyToOne(() => Teacher, teacher => teacher.years)
    teacher!: Teacher;

    @OneToMany(() => Student, student => student.year)
    students!: Student[];

}