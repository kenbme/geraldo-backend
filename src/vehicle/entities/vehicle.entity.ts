import {UUID} from 'crypto'
import {Component} from '../../component/entities/component.entity'
import {Driver} from '../../driver/entities/driver.entity'
import {Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn} from 'typeorm'

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: UUID
  @Column({type: 'varchar'})
  model: string
  @Column({type: 'varchar', unique: true})
  plate: string
  @Column({type: 'integer'})
  kilometers: number
  @Column({type: 'integer'})
  year: number
  @ManyToMany(() => Driver, (driver) => driver.vehicles)
  @JoinTable()
  owners: Driver[]
  @OneToMany(() => Component, (component) => component.vehicle)
  components: Component[]
}
