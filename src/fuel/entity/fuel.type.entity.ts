import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm'
import { Fuel } from './fuel.entity'
import { FuelTypeEnum } from 'src/shared/fuel/enum/fuelTypeEnum'

@Entity()
export class FuelType {
  @PrimaryGeneratedColumn()
  id: number
  @Column({type: 'varchar', unique: true})
  name: FuelTypeEnum
  @Column({type: 'varchar'})
  description: string
  @OneToMany(() => Fuel, (fuel) => fuel.fuelType)
  fuels: Fuel[]
}
