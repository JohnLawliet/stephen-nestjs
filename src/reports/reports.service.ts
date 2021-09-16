import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';
import { Reports } from './entities/reports.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Reports) private reportsRepository: Repository<Reports>,
  ) {}

  // below where param syntax
  // make column in entity is equal to received make value.
  // make value is extracted from query and compared to make in column so query is reduced to:
  // from .where('make = :make', { make: query.make }) to .where('make = query.make')
  // This is done to prevent sqlinjection when taking in raw sql queries
  // 'lng - :lng BETWEEN -5 AND 5' means where longitude is between -5 and 5 of given longitude value
  // orderBy() doesn't take a parameter so have to chain a setParameters() function
  // for more info on sql lookup typeorm docs
  // GetRawOne() coz we condense the results into one result i.e price (Average price)
  getEstimate({ make, model, lng, lat, mileage, year }: GetEstimateDto) {
    return this.reportsRepository
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .andWhere('approved IS TRUE')
      .orderBy('mileage - :mileage', 'DESC')
      .setParameters({ mileage })
      .limit(3)
      .getRawOne();
  }

  // passing the currentUser received using the custom decorator to add on as a value to the user property value of report entity
  async create(reportDto: CreateReportDto, currentUser: User) {
    const report = this.reportsRepository.create(reportDto);
    report.user = currentUser;
    return await this.reportsRepository.save(report);
  }

  async changeApproval(id: string, approval: boolean) {
    const report = await this.reportsRepository.findOne(id);
    if (!report) {
      throw new NotFoundException('report not found');
    }
    report.approved = approval;
    return this.reportsRepository.save(report);
  }
}
