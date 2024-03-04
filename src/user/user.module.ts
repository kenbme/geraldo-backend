import {Module} from '@nestjs/common'
import {UserService} from './user.service'
import {TypeOrmModule} from '@nestjs/typeorm'
import {User} from './entities/user.entity'
import { UserTypeService } from './user.type.service'
import { UserType } from './entities/user.type.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User]),
  TypeOrmModule.forFeature([UserType])],
  providers: [UserService, UserTypeService],
  exports: [UserService]
})
export class UserModule {}
