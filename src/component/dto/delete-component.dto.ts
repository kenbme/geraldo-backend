
import { IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class DeleteComponentDto {
  @IsUUID()
  readonly driverId: UUID;

  @IsUUID()
  readonly vehicleId: UUID;

  // O identificador do componente não precisa estar aqui, pois ele é passado como parte da URL
}
