import {Injectable} from '@nestjs/common'
import {StateSeeder} from '../address/seeders/state.seeder'
import {EstablishmentTypeSeeder} from '../establishment/seeders/establishment.type.seeder'
import {UserTypeSeeder} from '../user/seeders/user.type.seeder'
import {ComponentTypeSeeder} from '../component/seeders/component.type.seeder'
import { FuelTypeSeeder } from 'src/fuel/seeders/fuel.type.seeder'

@Injectable()
export class SeederService {
  constructor(
    private readonly stateSeeder: StateSeeder,
    private readonly establishmentTypeSeeder: EstablishmentTypeSeeder,
    private readonly userTypeSeeder: UserTypeSeeder,
    private readonly componentTypeSeeder: ComponentTypeSeeder,
    private readonly fuelTypeSeeder: FuelTypeSeeder
  ) {}

  async seed(): Promise<void> {
    await this.stateSeeder.seed()
    await this.establishmentTypeSeeder.seed()
    await this.userTypeSeeder.seed()
    await this.componentTypeSeeder.seed()
    await this.fuelTypeSeeder.seed()
  }
}
