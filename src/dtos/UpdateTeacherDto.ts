import { IsInt, IsOptional, IsString } from "class-validator";

export class UpdateTeacherDto {

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsInt()
    enrollmentNumber?: number;

    @IsOptional()
    @IsInt()
    yearId?: number;

    @IsOptional()
    @IsString()
    password?: string;
}
