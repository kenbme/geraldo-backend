import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Establishment } from "src/establishment/entities/establishment.entity";
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
        @InjectRepository(Shift)
        private readonly shiftRepository: Repository<Shift>,
        private readonly establishmentService: EstablishmentService,
        private readonly dataSource: DataSource
    ){}
    
    async create(scheduleDto:CreateScheduleDto,userId:number): Promise<Schedule>{
        const establishment = await this.establishmentService.findByUserId(userId)
        establishment.alwaysOpen = scheduleDto.always_open
        this.establishmentService.updateAlwaysOpen(establishment.id, scheduleDto.always_open)
      
        const newSchedule = new Schedule()
        newSchedule.establishment = establishment
        const schedule = await this.scheduleRepository.save(newSchedule)

        if(scheduleDto.always_open){
            const atualShift = new Shift
            atualShift.start = "0:00:00"
            atualShift.finish = "23:59:59"
            atualShift.schedule = schedule
            this.shiftRepository.save(atualShift)
        }else{
            if(await this.checkShift(scheduleDto.shifts)){
                if(await this.checkValidTime(scheduleDto.shifts)){
                    for(let b = 0;b<scheduleDto.shifts.length;b++){
                        const atualShift = new Shift
                        atualShift.start = scheduleDto.shifts[b][0]
                        atualShift.finish = scheduleDto.shifts[b][1]
                        atualShift.schedule = schedule
                        this.shiftRepository.save(atualShift)
                    }
                }
            }
        }   
        return schedule
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