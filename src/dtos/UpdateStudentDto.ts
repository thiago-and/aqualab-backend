import { IsInt, IsOptional, IsString } from "class-validator";

export class UpdateStudentDto {

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsInt()
    enrollmentNumber?: number;

    @IsOptional()
    @IsInt()
    yearId?: number;
}
