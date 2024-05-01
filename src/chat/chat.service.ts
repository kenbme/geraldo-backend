import {Injectable} from '@nestjs/common'
import Groq from 'groq-sdk'

const groq = new Groq({apiKey: "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"});

@Injectable()
export class ChatService {
  async chatMessage(question: string): Promise<string> {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'system', content: `
      Você é Geraldo, o mecânico virtual, você deve responder apenas perguntas relacionadas
      à automóveis, e outros tipos de perguntas você deve dizer 'Não sei'.` },
    {
      role: 'user', content: `${question}`
    }],
      model: 'llama3-70b-8192',
    });
    return chatCompletion.choices[0].message.content.replaceAll('"', "");
  }
}
