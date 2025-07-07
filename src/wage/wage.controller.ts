import { Controller, Post, Body } from '@nestjs/common';
import { WageService } from './wage.service';
import { StructuredInputDTO } from './dto/structured-input.dto';

@Controller('wage')
export class WageController {
  constructor(private readonly wageService: WageService) {}

  @Post('analyze')
  async analyzeText(@Body('text') text: string) {
    return this.wageService.extractInfo(text);
  }
  @Post('predict')
  async predict(@Body() input: StructuredInputDTO) {
    const wage = await this.wageService.predictWage(input);
    return { predictedWage: wage };
  }
}
