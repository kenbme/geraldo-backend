import { IsInt, IsNotEmpty, Max, Min } from "class-validator"

export class CreateAvaliationDto{
    comment: string
    @Min(0,{message: "A nota nao ode ser inferior a 0"}) 
    @Max(5, {message: "A nota nao pode ser superior a 5"})
    @IsNotEmpty({message: "A nota nao pode ser vazia"})
    @IsInt({message: "A nota deve ser um número inteiro"})
    grade: number
    date: Date
}