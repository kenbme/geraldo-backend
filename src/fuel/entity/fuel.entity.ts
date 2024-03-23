import { Establishment } from 'src/establishment/entities/establishment.entity'
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm'
import { FuelType } from './fuel.type.entity'

@Entity()
export class Fuel {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => FuelType,(fuelType) => fuelType.fuels )
  fuelType: FuelType

  @Column({type: 'varchar'})
  fuelTitle: string

  @Column({type: 'float'})
  value: number

  @Column({type: 'boolean'})
  productStatus: boolean

  @ManyToOne (() => Establishment, (establishment) => establishment.fuels)
  establishment: Establishment

}
