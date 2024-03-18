import {Vehicle} from '../../vehicle/entities/vehicle.entity'
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm'
import {ComponentType} from './component.type.entity'

@Entity()
export class Component {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => ComponentType, {eager: true})
  componentType: ComponentType

  @Column({type: 'date'})
  dateLastExchange: Date

  @Column({type: 'integer'})
  kilometersLastExchange: number

  @Column({type: 'integer'})
  maintenanceFrequency: number

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.components)
  vehicle: Vehicle
}
