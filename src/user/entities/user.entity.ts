import { Reports } from '../../reports/entities/reports.entity';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'User' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  admin: boolean;

  @OneToMany(() => Reports, (reports) => reports.user)
  reports: Reports[];

  // these are hooks.
  // when creating a user, an instance gets created which is then saved. This calls any hooks after the operation
  // if save is used directly then a plain object gets saved instead which bypasses hook calls
  // this is applicable to save vs create/insert/update or remove vs delete
  // insert, update, delete bypasses use of hooks
  @AfterInsert()
  logInsert() {
    console.log('Inserted BOOZER', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('updated da BOOZER', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('removed da ...BOOZER', this.id);
  }
}
