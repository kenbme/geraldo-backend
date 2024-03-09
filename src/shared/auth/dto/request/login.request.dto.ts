import {IsString} from 'class-validator'
import {IsDocument} from '../../validators/IsDocument'

export class LoginRequestDTO {
  @IsDocument()
  username: string
  @IsString({message: 'A senha deve ser uma string'})
  password: string
}
