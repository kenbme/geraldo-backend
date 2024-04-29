import {IsString, Length} from 'class-validator'

export class ChatMessageDTO {
  @IsString()
  @Length(10, 100)
  question: string
}
