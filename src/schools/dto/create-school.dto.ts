import { IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { InstituteType } from '../institute-type.config';

export class CreateSchoolDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  code!: string;

  @IsOptional()
  @IsEnum(InstituteType)
  instituteType?: InstituteType;

  @IsOptional()
  @IsString()
  @Matches(/^[A-Z]{2}$/, { message: 'countryCode must be a 2-letter ISO country code' })
  countryCode?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[A-Z]{3}$/, { message: 'currencyCode must be a 3-letter ISO currency code' })
  currencyCode?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  timezone?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[a-z]{2}(?:-[A-Z]{2})?$/, { message: 'locale must look like en or en-US' })
  locale?: string;
}
