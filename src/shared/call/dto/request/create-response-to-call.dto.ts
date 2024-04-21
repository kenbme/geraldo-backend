import { IsBoolean, IsInt } from "class-validator";

export class RespondToCallDTO {
    @IsInt()
    callId: number;

    @IsBoolean()
    accepted: boolean;
  }
  