
import { IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class DeleteComponentDto {
  @IsUUID()
    driverId: UUID;

  @IsUUID()
   vehicleId: UUID;

  // O id componente não eh necessario, pois eh passado na URL
}
