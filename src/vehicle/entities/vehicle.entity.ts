import { UUID } from 'crypto';
import { Driver } from "src/driver/entities/driver.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Vehicle{
    @PrimaryGeneratedColumn()
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
    owners: Driver[]
}