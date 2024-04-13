import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm'
import {Component} from './component.entity'

@Entity()
export class ComponentHistory {
  @PrimaryGeneratedColumn()
  id: number
  @ManyToOne(() => Component, (components) => components.ComponentHistory)
  component: Component
  
  @Column({type: 'date'})
  dateLastExchange: Date

  @Column({type: 'integer'})
  kilometersLastExchange: number

  @Column({type: 'integer'})
  maintenanceFrequency: number
}