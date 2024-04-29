import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { EstablishmentService } from '../establishment/establishment.service'
import { CreateScheduleDto } from '../shared/schedule/request/create-schedule.dto'
import { Schedule } from './entities/schedule.entity'
import { Shift } from './entities/shift.entity'

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    @InjectRepository(Shift)
    private readonly shiftRepository: Repository<Shift>,
    private readonly establishmentService: EstablishmentService
  ) {}

  async create(scheduleDto: CreateScheduleDto, userId: number): Promise<Schedule> {
    if(scheduleDto.shifts.length >3){
      throw new BadRequestException({message: 'O número máximo de turnos é 3'})
    }
    const establishment = await this.establishmentService.findByUserId(userId)
    establishment.alwaysOpen = scheduleDto.always_open
    this.establishmentService.updateAlwaysOpen(establishment.id, scheduleDto.always_open)

    const newSchedule = new Schedule()
    newSchedule.establishment = establishment
    const schedule = await this.scheduleRepository.save(newSchedule)

    if (scheduleDto.always_open) {
      const atualShift = new Shift()
      atualShift.start = '0:00:00'
      atualShift.finish = '23:59:59'
      atualShift.schedule = schedule
      this.shiftRepository.save(atualShift)
    } else {
      if (await this.checkShift(scheduleDto.shifts)) {
        if (await this.checkValidTime(scheduleDto.shifts)) {
          for (let b = 0; b < scheduleDto.shifts.length; b++) {
            const atualShift = new Shift()
            atualShift.start = scheduleDto.shifts[b][0]
            atualShift.finish = scheduleDto.shifts[b][1]
            atualShift.schedule = schedule
            this.shiftRepository.save(atualShift)
          }
        } else {
          throw new BadRequestException({
            message:
              'O horario do inicio de um turno precisam ser maiores que o do final do anterior'
          })
        }
      } else {
        throw new BadRequestException({
          message: 'O horario do inicio de um turno precisam ser maiores que o do final'
        })
      }
    }
    return schedule
  }

  checkShift(shifts: string[][]): boolean {
    for (let a = 0; a < shifts.length; a++) {
      if (shifts[a][1] <= shifts[a][0]) {
        return false
      }
    }
    return true
  }

  checkValidTime(shifts: string[][]): boolean {
    for (let a = 0; a < shifts.length - 1; a++) {
      const oldest = shifts[a][1]
      const newest = shifts[a + 1][0]
      if (oldest > newest) {
        return false
      }
    }
    return true
  }
}