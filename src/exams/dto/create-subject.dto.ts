import { IsInt, IsOptional, IsString, Min } from 'class-validator';
export class CreateSubjectDto {
  @IsString() name!: string;
  @IsOptional() @IsInt() @Min(1) maxMarks?: number;
}
