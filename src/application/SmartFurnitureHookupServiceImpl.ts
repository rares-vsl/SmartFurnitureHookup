import { SmartFurnitureHookupService } from "../domain/ports/SmartFurnitureHookupService";
import { consumptionTypeFromString } from "../domain/ConsumptionType";
import { SmartFurnitureHookup } from "../domain/SmartFurnitureHookup";
import { SmartFurnitureHookupID } from "../domain/SmartFurnitureHookupID";
import { SmartFurnitureHookupRepository } from "../domain/ports/SmartFurnitureHookupRepository";
import { SmartFurnitureHookupFactory } from "../domain/SmartFurnitureHookupFactory";
import { SmartFurnitureHookupNotFoundError } from "../domain/errors/errors";

export class SmartFurnitureHookupServiceImpl
  implements SmartFurnitureHookupService
{
  constructor(
    private readonly smartFurnitureHookupRepository: SmartFurnitureHookupRepository,
  ) {}

  async createSFH(
    name: string,
    type: string,
    endpoint: string,
  ): Promise<SmartFurnitureHookup> {
    const consumptionType = consumptionTypeFromString(type);

    return this.smartFurnitureHookupRepository.addSmartFurnitureHookup(
      new SmartFurnitureHookupFactory().createSmartFurnitureHookup(
        name,
        consumptionType,
        endpoint,
      ),
    );
  }

  async deleteSFH(id: SmartFurnitureHookupID): Promise<void> {
    const sfh =
      await this.smartFurnitureHookupRepository.findSmartFurnitureHookupByID(
        id,
      );

    if (!sfh) {
      throw new SmartFurnitureHookupNotFoundError();
    }

    return this.smartFurnitureHookupRepository.removeSmartFurnitureHookup(sfh);
  }

  async getSmartFurnitureHookups(): Promise<SmartFurnitureHookup[]> {
    return this.smartFurnitureHookupRepository.findAllSmartFurnitureHookup();
  }

  async getSFH(
    id: SmartFurnitureHookupID,
  ): Promise<SmartFurnitureHookup | null> {
    return this.smartFurnitureHookupRepository.findSmartFurnitureHookupByID(id);
  }

  async updateSFH(
    id: SmartFurnitureHookupID,
    name?: string,
    endpoint?: string,
  ): Promise<SmartFurnitureHookup> {
    const currentSFH =
      await this.smartFurnitureHookupRepository.findSmartFurnitureHookupByID(
        id,
      );

    if (!currentSFH) {
      throw new SmartFurnitureHookupNotFoundError();
    }

    const updateSFH: SmartFurnitureHookup = {
      ...currentSFH,
      name: name ?? currentSFH.name,
      endpoint: endpoint ?? currentSFH.endpoint,
    };

    return this.smartFurnitureHookupRepository.updateSmartFurnitureHookup(
      updateSFH,
    );
  }
}
