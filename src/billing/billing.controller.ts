import { Controller, Post, Get, Param, Body, Patch } from '@nestjs/common';
import { BillingService } from './billing.service';
import { GenerateBillDto } from './dto/generate-bill.dto';


@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('generate')
  async generate(@Body() dto: GenerateBillDto) {
    return this.billingService.generateBillsForMonth(dto.month);
  }

  @Get()
  async findAll() {
    return this.billingService.getBills();
  }

  @Get(':studentId')
  async findByStudent(@Param('studentId') id: string) {
    return this.billingService.getBillByStudent(id);
  }

  @Patch(':id/pay')
  async markPaid(@Param('id') id: string) {
    return this.billingService.markAsPaid(id);
  }
}
