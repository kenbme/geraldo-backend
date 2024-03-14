import {Injectable} from '@nestjs/common'
import {StateSeeder} from './addresses/seeders/state.seeder'
import {EstablishmentTypeSeeder} from './establishment/seeders/establishment.type.seeder'
import {UserTypeSeeder} from './user/seeders/user.type.seeder'

@Injectable()
export class SeederService {
  constructor(
    private readonly stateSeeder: StateSeeder,
    private readonly establishmentTypeSeeder: EstablishmentTypeSeeder,
    private readonly userTypeSeeder: UserTypeSeeder
  ) {}

  async seed(): Promise<void> {
    await this.stateSeeder.seed()
    await this.establishmentTypeSeeder.seed()
    await this.userTypeSeeder.seed()
  }
}
