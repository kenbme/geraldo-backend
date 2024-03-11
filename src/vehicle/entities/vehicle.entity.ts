import { UUID } from 'crypto';
import { Driver } from "src/driver/entities/driver.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Vehicle{
    @PrimaryGeneratedColumn()
    id: number
    @Column({type: 'uuid', unique: true})
    uuid: UUID
    @Column({type: 'varchar'})
    model: string
    @Column({type: 'varchar', unique: true})
    plate: string
    @Column({type: 'number'})
    kilometers: number
    @Column({type: 'number'})
    year: number
    @ManyToMany(() => Driver, (driver) => driver.vehicles, {eager: true})
    owners: Driver[]
}