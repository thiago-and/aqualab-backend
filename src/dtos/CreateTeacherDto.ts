import { IsEmail, IsInt, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateTeacherDto {

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsInt()
    @IsNotEmpty()
    enrollmentNumber!: number;

    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @MinLength(5)
    @IsNotEmpty()
    password!: string;
}
