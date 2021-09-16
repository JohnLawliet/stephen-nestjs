import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Serialize } from '../interceptors/serialize.interceptor';
import { User } from '../user/entities/user.entity';
import { ApproveDto } from './dtos/approve-report.dto';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportDto } from './dtos/report.dto';
import { ReportsService } from './reports.service';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  async getEstimate(@Query() query: GetEstimateDto) {
    const { price } = await this.reportsService.getEstimate(query);
    const result = Math.floor(price);
    return { price: result };
  }

  @UseGuards(AuthGuard)
  @Post('create')
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(body, user);
  }

  @Patch(':id')
  updateReport(@Param('id') id: string, @Body() body: ApproveDto) {
    return this.reportsService.changeApproval(id, body.approved);
  }
}
