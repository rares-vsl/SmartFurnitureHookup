import { SmartFurnitureHookup } from "../SmartFurnitureHookup";
import { SmartFurnitureHookupID } from "../SmartFurnitureHookupID";

/**
 * Service interface for managing smart furniture hookup.
 */
export interface SmartFurnitureHookupService {
  getSmartFurnitureHookups(): Promise<SmartFurnitureHookup[]>;

  getSFH(id: SmartFurnitureHookupID): Promise<SmartFurnitureHookup | null>;

  createSFH(
    name: string,
    consumption: string,
    endpoint: string,
  ): Promise<SmartFurnitureHookup>;

  updateSFH(
    id: SmartFurnitureHookupID,
    name: string,
    endpoint: string,
  ): Promise<SmartFurnitureHookup>;

  deleteSFH(id: SmartFurnitureHookupID): Promise<void>;
}
