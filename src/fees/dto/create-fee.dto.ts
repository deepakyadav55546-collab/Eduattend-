import { IsDateString, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateFeeDto {
  @IsString() studentId!: string;
  @IsString() title!: string;
  @IsNumber() @Min(0) amount!: number;
  @IsOptional() @IsDateString() dueDate?: string;
  @IsOptional() @IsString() note?: string;
}
