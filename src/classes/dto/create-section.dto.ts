import { IsString, MinLength } from 'class-validator';
export class CreateSectionDto { @IsString() classId!: string; @IsString() @MinLength(1) name!: string; }
