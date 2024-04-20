import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EstablishmentService } from "src/establishment/establishment.service";
import { CreateCallDTO } from "src/shared/call/dto/request/create-call.dto";
import { UserTypeEnum } from "src/shared/user/enums/user-type.enum";
import { UserService } from "src/user/user.service";
import { createCallResponseDTO } from "src/util/mapper";
import { DataSource, Repository } from "typeorm";
import { Call } from "./entites/call.entity";

@Injectable()
export class CallService{

    constructor(private readonly userService: UserService,
        private readonly establishmentService: EstablishmentService,
        @InjectRepository(Call)
        private readonly callRepository: Repository<Call>,
        private readonly dataSource: DataSource
    ) {}

    async create(userId:number,callDTO:CreateCallDTO){
        const user = await  this.userService.findById(userId)
        if (user.userType.name !== UserTypeEnum.DRIVER) {
            throw new ForbiddenException('Você não pode associar esse usuário')
        }
        const newCall = new Call
        newCall.comment = callDTO.comment
        newCall.latitude = callDTO.latitude
        newCall.longitude = callDTO.longitude
        newCall.user = user
        const establishments = await this.establishmentService.getClosestEstablishments(callDTO.latitude,callDTO.longitude)
        newCall.establishments = establishments
        this.dataSource.manager.save(Call,newCall)
        const response = createCallResponseDTO(newCall)
        return response
    }
}