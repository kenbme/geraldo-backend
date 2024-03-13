import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm'
import { Component } from './component.entity'

@Entity()
export class ComponentType {
  @PrimaryGeneratedColumn('uuid')
  id: string
  @Column({type: 'varchar', unique: true})
  name: string
  @OneToMany(() => Component, (components) => components.componentsType)
  components: Component
}
