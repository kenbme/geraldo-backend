import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EstablishmentModule } from "src/establishment/establishment.module";
import { UserModule } from "src/user/user.module";
import { Schedule } from "./entities/schedule.entity";
import { ScheduleController } from "./schedule.controller";
import { ScheduleService } from "./schedule.service";

@Module({
    imports: [EstablishmentModule, UserModule, TypeOrmModule.forFeature([Schedule])],
    providers: [ScheduleService],
    exports: [ScheduleService],
    controllers: [ScheduleController]
  })
  export class ScheduleModule {}