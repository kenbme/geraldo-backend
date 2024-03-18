import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm'
import {Component} from './component.entity'
import { ComponentTypeEnum } from 'src/shared/component/enums/component-type.enum'

@Entity()
export class ComponentType {
  @PrimaryGeneratedColumn()
  id: number
  @Column({type: 'varchar', unique: true})
  name: ComponentTypeEnum
  @OneToMany(() => Component, (components) => components.componentType)
  components: Component
}
