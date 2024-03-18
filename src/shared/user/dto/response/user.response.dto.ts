import { UUID } from "crypto";

export class UserResponseDTO {
    id: UUID
    username: string
    email: string
    name: string
}