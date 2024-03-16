import {Vehicle} from '../../vehicle/entities/vehicle.entity'
import {Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn} from 'typeorm'
import {ComponentType} from './component.type.entity'
import { UUID } from 'crypto'

@Entity()
export class Component {
  @PrimaryGeneratedColumn('uuid')
  id: UUID

  @OneToOne(() => ComponentType)
  componentType: ComponentType

  @Column({type: 'date'})
  dateLastExchange: Date

  @Column({type: 'integer'})
  kilometersLastExnchange: number

  @Column({type: 'integer'})
  maintenanceFrequency: number

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.components)
  vehicle: Vehicle
}
