import { User } from '../../user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Reports' })
export class Reports {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  approved: boolean;

  @Column()
  price: number;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column()
  lng: number;

  @Column()
  lat: number;

  @Column()
  mileage: number;

  // NOTE: the () => User is needed because a circular dependancy gets formed otherwise.
  // with the relation function, both the entities are defined and known to nest and then their properties can be used
  @ManyToOne(() => User, (user) => user.reports)
  user: User;
}
