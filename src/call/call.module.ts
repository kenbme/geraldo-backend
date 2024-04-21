import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EstablishmentModule } from "src/establishment/establishment.module";
import { UserModule } from "src/user/user.module";
import { CallController } from "./call.controller";
import { CallService } from "./call.service";
import { Call } from "./entites/call.entity";

@Module({
    imports: [ TypeOrmModule.forFeature([Call]),EstablishmentModule,UserModule],
    providers: [CallService],
    exports: [CallService],
    controllers: [CallController]
  })
  export class CallModule {}