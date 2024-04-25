import {Injectable} from '@nestjs/common'

@Injectable()
export class ChatService {
  chatMessage(question: string): string {
    return 'Sou o Batman'
  }
}
