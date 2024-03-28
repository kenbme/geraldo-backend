import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EstablishmentService } from "src/establishment/establishment.service";
import { CreateScheduleDto } from "src/shared/schedule/request/create-schedule.dto";
import { DataSource, Repository } from "typeorm";
import { Schedule } from "./entities/schedule.entity";
import { Shift } from "./entities/shift.entity";

@Injectable()
export class ScheduleService{
    constructor(
        @InjectRepository(Schedule)
        private readonly scheduleRepository: Repository<Schedule>,
        private readonly establishmentService: EstablishmentService,
        private readonly dataSource: DataSource
    ){}
    
    async create(schedule:CreateScheduleDto,establishmentId:number): Promise<Schedule>{
        const establishment = await this.establishmentService.findById(establishmentId)
        const newSchedule = new Schedule
        if(await this.checkShift(schedule.shifts)){
            if(await this.checkValidTime(schedule.shifts)){
                for(let b = 0;b<schedule.shifts.length;b++){
                    const atualShift = new Shift
                    atualShift.start = schedule.shifts[b][0]
                    atualShift.finish = schedule.shifts[b][1]
                    newSchedule.shifts.push(atualShift)
                }
            }
        }
        newSchedule.working_days = schedule.working_days
        newSchedule.establishment = establishment
        const createdSchedule = await this.dataSource.manager.save(Schedule, newSchedule)
        establishment.schedule = newSchedule
        const createdSchedule = await this.dataSource.manager.save(Schedule, newSchedule)

        return createdSchedule
    }

    async checkShift(shifts: string[][]):Promise<Boolean>{
        for(let a =0; a<shifts.length ;a++){
            if(shifts[a][1] <= shifts[a][0]){
                return false
            }
        }
        return true
    }

    async checkValidTime(shifts: string[][]){
        for(let a =0; a<shifts.length-1 ;a++){
            let oldest = shifts[a][1]
            let newest = shifts[a+1][0]
            if(oldest > newest){
                return false
            }
        }
        return true
    }
}