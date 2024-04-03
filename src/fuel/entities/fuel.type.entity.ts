import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm'
import { Fuel } from './fuel.entity'
import { FuelTypeEnum } from '../../shared/fuel/enum/fuel.type.enum'

@Entity()
export class FuelType {
  @PrimaryGeneratedColumn()
  id: number
  @Column({type: 'varchar', unique: true})
  name: FuelTypeEnum
  @OneToMany(() => Fuel, (fuel) => fuel.fuelType)
  fuels: Fuel
} 
