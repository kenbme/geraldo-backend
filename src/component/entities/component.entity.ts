import {Vehicle} from '../../vehicle/entities/vehicle.entity'
import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm'
import {ComponentType} from './component.type.entity'
import {ComponentHistory} from './ComponentHistory.entity'

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
  @OneToMany(() => ComponentHistory, (ComponentHistory) => ComponentHistory.component)
  ComponentHistory: Component
}
