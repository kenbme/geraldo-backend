import {Controller, Get, Query} from '@nestjs/common'
import {ChatService} from './chat.service'
import {UserTypeEnum} from '../shared/user/enums/user-type.enum'
import {Roles} from '../config/decorator'
import {ChatMessageDTO} from '../shared/chat/request/chat.message.dto'

@Controller('')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Roles(UserTypeEnum.DRIVER)
  @Get('/chatMessage')
  async chatMessage(
    @Query() query: ChatMessageDTO
  ): Promise<{data: {response: string}; message: string}> {
    const response = await this.chatService.chatMessage(query.question)
    const data = {response}
    return {data, message: 'Respondido'}
  }
}
