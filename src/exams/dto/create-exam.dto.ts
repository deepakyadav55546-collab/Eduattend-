import { IsDateString, IsInt, IsOptional, IsString, Min } from 'class-validator';
export class CreateExamDto {
  @IsString() name!: string;
  @IsOptional() @IsDateString() startDate?: string;
  @IsOptional() @IsDateString() endDate?: string;
}
