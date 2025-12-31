import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateStudentDto {

    @IsString()
    @IsNotEmpty({ message: "Name is required" })
    name!: string;

    @IsInt()
    @IsNotEmpty({ message: "Enrollment number is required" })
    enrollmentNumber!: number;

    @IsInt()
    @IsNotEmpty({ message: "Year is required" })
    year!: number;
    
}
