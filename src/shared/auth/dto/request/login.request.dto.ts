import {IsNotEmpty, IsString} from 'class-validator'
import {IsDocument} from '../../validators/IsDocument'

export class LoginRequestDTO {
  @IsNotEmpty()
  @IsDocument()
  username: string
  @IsNotEmpty()
  @IsString({message: 'A senha deve ser uma string'})
  password: string
}
