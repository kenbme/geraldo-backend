import {Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common'
import {EstablishmentService} from './establishment.service'
import {CreateEstablishmentDto} from './dto/create-establishment.dto'
import {UpdateEstablishmentDto} from './dto/update-establishment.dto'

@Controller('')
export class EstablishmentController {
  constructor(private readonly establishmentService: EstablishmentService) {}

  @Post('/establishment_register')
  create(@Body() createEstablishmentDto: CreateEstablishmentDto) {
    return this.establishmentService.create(createEstablishmentDto)
  }
}
