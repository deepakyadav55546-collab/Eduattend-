import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class PayFeeDto {
  @IsNumber() @Min(0.01) amount!: number;
  @IsOptional() @IsString() paymentMode?: string;
  @IsOptional() @IsString() referenceNo?: string;
  @IsOptional() @IsString() note?: string;
}
