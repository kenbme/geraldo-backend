import { UserTypeEnum } from "src/shared/user/enums/user-type.enum";
import { User } from "src/user/entities/user.entity";
import { UserType } from "src/user/entities/user.type.entity";

export class LoginPayload {
    id: number;
    typeUser: UserType;
  
    constructor(user: User) {
      this.id = user.id;
      this.typeUser = user.userType;
    }
  }