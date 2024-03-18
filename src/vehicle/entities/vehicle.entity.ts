import { UUID } from 'crypto'
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Component } from '../../component/entities/component.entity'
import { Driver } from '../../driver/entities/driver.entity'

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
  @OneToMany(() => Driver, (driver) => driver.vehicle)
  @JoinColumn()
  drivers: Driver[]
  @OneToMany(() => Component, (component) => component.vehicle)
  components: Component[]
}
