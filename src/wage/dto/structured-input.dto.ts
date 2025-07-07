// src/wage/dto/structured-input.dto.ts
import { IsString } from 'class-validator';

export class StructuredInputDTO {
  @IsString()
  age: string;

  
  @IsString()
  experienceYears: string;


  @IsString()
  education: string;


  @IsString()
  gender: string;


  @IsString()
  country: string;



  @IsString()
  industry: string;
}
