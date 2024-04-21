import { ForbiddenException, Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EstablishmentService } from "src/establishment/establishment.service";
import { CreateCallDTO } from "src/shared/call/dto/request/create-call.dto";
import { UserTypeEnum } from "src/shared/user/enums/user-type.enum";
import { UserService } from "src/user/user.service";
import { DataSource, Repository } from "typeorm";
import { Call } from "./entites/call.entity";
import { RespondToCallDTO } from "src/shared/call/dto/request/create-response-to-call.dto";

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
        const response = this.dataSource.manager.save(Call,newCall)
        return response
    }

    async respondCall(userId: number, dto: RespondToCallDTO) {
        const establishment = await this.establishmentService.findByUserId(userId);

        const call = await this.callRepository.findOne({
            where: { id: dto.callId },
            relations: ['establishmentAccepted', 'establishments']
          });

        if (!call) {
            throw new NotFoundException('Chamada não encontrado')
        }
        if (dto.accepted === false) {
            const index = call.establishments.findIndex(
              (est) => est.id === establishment.id,
            );
            if (index !== -1) {
              call.establishments.splice(index, 1);
            }
            await this.callRepository.save(call);
            return call;
          } 
        const establishmentIds = call.establishments.map(establishment => establishment.user.id);
        if (!establishmentIds.includes(userId)) {
          throw new BadRequestException('Chamada não realizada para seu estabelecimento');
        }
        if (call.establishmentAccepted) {
          throw new BadRequestException('Esta chamada já foi aceita por outro estabelecimento.');
        }
    
        call.establishmentAccepted = establishment;

        await this.callRepository.save(call);
        return call;
      }
}