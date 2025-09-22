import { SmartFurnitureHookupRepository } from "../../domain/ports/SmartFurnitureHookupRepository";
import { SmartFurnitureHookup } from "../../domain/SmartFurnitureHookup";
import { SmartFurnitureHookupID } from "../../domain/SmartFurnitureHookupID";
import { v4 as uuidv4, validate } from "uuid";
import {
  InvalidIDError,
  SFHEndpointConflictError,
  SFHNameConflictError,
  SmartFurnitureHookupNotFoundError,
} from "../../domain/errors/errors";

export class InMemorySmartFurnitureHookupRepository
  implements SmartFurnitureHookupRepository
{
  private sfh: SmartFurnitureHookup[] = [];

  private checkForConflicts(smartFurnitureHookup: SmartFurnitureHookup) {
    const existingSFH = this.sfh.find(
      (sfh) =>
        (sfh.name === smartFurnitureHookup.name ||
          sfh.endpoint === smartFurnitureHookup.endpoint) &&
        sfh.id.value !== smartFurnitureHookup.id.value,
    );

    if (!existingSFH) return;

    if (existingSFH && existingSFH.name === smartFurnitureHookup.name) {
      throw new SFHNameConflictError(smartFurnitureHookup.name);
    }

    if (existingSFH && existingSFH.endpoint === smartFurnitureHookup.endpoint) {
      throw new SFHEndpointConflictError(smartFurnitureHookup.endpoint);
    }
  }

  async addSmartFurnitureHookup(
    smartFurnitureHookup: SmartFurnitureHookup,
  ): Promise<SmartFurnitureHookup> {
    this.checkForConflicts(smartFurnitureHookup);

    const newSFH: SmartFurnitureHookup = {
      ...smartFurnitureHookup,
      id: { value: uuidv4() },
    };

    this.sfh.push(newSFH);

    return newSFH;
  }

  async findSmartFurnitureHookupByID(
    id: SmartFurnitureHookupID,
  ): Promise<SmartFurnitureHookup | null> {
    this.validateSFHID(id);

    const sfh = this.sfh.find((sfh) => sfh.id.value === id.value);

    return sfh ? sfh : null;
  }

  async findAllSmartFurnitureHookup() {
    return this.sfh;
  }

  async updateSmartFurnitureHookup(
    smartFurnitureHookup: SmartFurnitureHookup,
  ): Promise<SmartFurnitureHookup> {
    this.validateSFHID(smartFurnitureHookup.id);

    const sfhIndex = this.sfh.findIndex(
      (sfh) => sfh.id.value === smartFurnitureHookup.id.value,
    );

    if (sfhIndex === -1) {
      throw new SmartFurnitureHookupNotFoundError();
    }

    this.checkForConflicts(smartFurnitureHookup);

    const updatedSFH = {
      ...this.sfh[sfhIndex],
      name: smartFurnitureHookup.name,
      endpoint: smartFurnitureHookup.endpoint,
    };

    this.sfh[sfhIndex] = updatedSFH;

    return updatedSFH;
  }

  async removeSmartFurnitureHookup(
    smartFurnitureHookup: SmartFurnitureHookup,
  ): Promise<void> {
    this.validateSFHID(smartFurnitureHookup.id);

    const sfhIndex = this.sfh.findIndex(
      (sfh) => sfh.id.value === smartFurnitureHookup.id.value,
    );

    if (sfhIndex === -1) {
      throw new SmartFurnitureHookupNotFoundError();
    }

    this.sfh.splice(sfhIndex, 1);
  }

  private validateSFHID(value: SmartFurnitureHookupID) {
    if (!validate(value.value)) {
      throw new InvalidIDError();
    }
  }

  clear() {
    this.sfh = [];
  }

  length() {
    return this.sfh.length;
  }
}
