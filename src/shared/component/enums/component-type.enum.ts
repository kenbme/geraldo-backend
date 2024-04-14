export enum ComponentTypeEnum {
  MOTOR_OIL = 'MOTOR_OIL',
  BALANCE = 'BALANCE',
  AIR_FILTER = 'AIR_FILTER'
}

export const ComponentTypeLimits: Record<ComponentTypeEnum, { maxTimeBeforeMaintenance: number, maxKmBeforeMaintenance: number }> = {
  [ComponentTypeEnum.MOTOR_OIL]: { maxTimeBeforeMaintenance: 12, maxKmBeforeMaintenance: 100000 }, // Óleo do Motor
  [ComponentTypeEnum.BALANCE]: { maxTimeBeforeMaintenance: 6, maxKmBeforeMaintenance: 80000 }, // Balanceamento
  [ComponentTypeEnum.AIR_FILTER]: { maxTimeBeforeMaintenance: 9, maxKmBeforeMaintenance: 120000 } // Filtro de Ar
};