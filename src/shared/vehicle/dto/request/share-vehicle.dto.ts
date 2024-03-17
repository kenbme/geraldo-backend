import { IsCPF } from "src/shared/user/validators/IsCPF";

export class ShareVehicleDto {
    @IsCPF()
    cpf: string;
  }
  