import {Vehicle} from '../../vehicle/entities/vehicle.entity'
import {Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn} from 'typeorm'
import {ComponentType} from './component.type.entity'

@Entity()
export class Component {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @OneToOne(() => ComponentType)
  componentType: ComponentType

  @Column({type: 'datetime'})
  dateLastExchange: Date

  @Column({type: 'integer'})
  kilometersLastExnchange: number

  @Column({type: 'integer'})
  maintenanceFrequency: number

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.components)
  vehicle: Vehicle
}
