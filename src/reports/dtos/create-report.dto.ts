import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

// role of DTO:
// validation pipe checks the dto and ensures these props are applied to the correct incoming request path
export class CreateReportDto {
  @IsNumber()
  @Min(10)
  @Max(10000000)
  price: number;

  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(1940)
  @Max(2040)
  year: number;

  @IsLongitude()
  lng: number;

  @IsLatitude()
  lat: number;

  @IsNumber()
  @Min(10)
  @Max(10000000)
  mileage: number;
}
