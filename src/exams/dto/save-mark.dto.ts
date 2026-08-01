import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';
export class SaveMarkDto {
  @IsString() studentId!: string;
  @IsString() subjectId!: string;
  @IsNumber() @Min(0) marks!: number;
  @IsOptional() @IsString() grade?: string;
}
