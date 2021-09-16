import { Expose, Transform } from 'class-transformer';

// This DTO is meant to just format all the data that gets sent back to user
// otherwise the response object wouuld look like:
// {
//     "price": 10000,
//     "make": "toyota",
//     "model": "sexy",
//     "year": 1947,
//     "lng": 0,
//     "lat": 0,
//     "mileage": 10000,
//     "user": {
//         "id": 1,
//         "email": "bru@bru.com",
//         "password": "e5f41ad0ab4df164.d01afb640b7870341bb7c7dcae34983295db63c526ded4179955cbe354e35588"
//     },
//     "id": 2
// }
// it should havea a prop userId that refers to a user

export class ReportDto {
  @Expose()
  id: number;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  price: number;

  @Expose()
  lng: number;

  @Expose()
  lat: number;

  @Expose()
  mileage: number;

  @Expose()
  approved: boolean;

  @Expose()
  year: number;

  //   ({ obj }) refers to the original report object.
  //  takes id from the user object and applies it to userId property
  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;
}
