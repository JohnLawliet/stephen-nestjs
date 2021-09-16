import { Transform } from 'class-transformer';
import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

// This dto uses a query string.
// Query strings by default are all treated as strings even for numbers
export class GetEstimateDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  //   Transform takes the input value and converts it into something else
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1940)
  @Max(2040)
  year: number;

  //   although lng and lat are by default numbers because of their decorator. They can't represent floating numbers
  @Transform(({ value }) => parseFloat(value))
  @IsLongitude()
  lng: number;

  @Transform(({ value }) => parseFloat(value))
  @IsLatitude()
  lat: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(10)
  @Max(10000000)
  mileage: number;
}
