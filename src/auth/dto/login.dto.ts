import {IsString} from 'class-validator'
import {IsDocument} from '../validators/IsDocument'

export class LoginDTO {
  @IsDocument()
  username: string
  @IsString()
  password: string
}
