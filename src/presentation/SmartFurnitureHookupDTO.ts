import { SmartFurnitureHookup } from "../domain/SmartFurnitureHookup";

export interface SmartFurnitureHookupDTO {
  id: string;
  name: string;
  type: string;
  consumptionUnit: string;
  endpoint: string;
}

export const smartFurnitureHookupDTOMapper = {
  toDTO(sfh: SmartFurnitureHookup): SmartFurnitureHookupDTO {
    return {
      id: sfh.id.value,
      name: sfh.name,
      type: sfh.consumption.type.toLowerCase(),
      consumptionUnit: sfh.consumption.unit,
      endpoint: sfh.endpoint,
    };
  },
};
