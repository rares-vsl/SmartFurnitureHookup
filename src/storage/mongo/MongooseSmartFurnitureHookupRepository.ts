import { SmartFurnitureHookupRepository } from "../../domain/ports/SmartFurnitureHookupRepository";
import { SmartFurnitureHookup } from "../../domain/SmartFurnitureHookup";
import { SmartFurnitureHookupID } from "../../domain/SmartFurnitureHookupID";
import { v4 as uuidv4, validate } from "uuid";
import { SmartFurnitureHookupDocument } from "./mongoose/SmartFurnitureHookupDocument";
import { consumptionTypeFromString } from "../../domain/ConsumptionType";
import { Consumption } from "../../domain/Consumption";
import { consumptionUnitFromString } from "../../domain/ConsumptionUnit";
import { SmartFurnitureHookupModel } from "./mongoose/SmartFurnitureHookupModel";
import {
  SFHEndpointConflictError,
  SFHNameConflictError,
  SmartFurnitureHookupNotFoundError,
} from "../../domain/errors/errors";
import { MongoServerError } from "mongodb";

export class MongooseSmartFurnitureHookupRepository
  implements SmartFurnitureHookupRepository
{
  private handleSmartFurnitureHookupConflict(
    error: MongoServerError,
    smartFurnitureHookup: SmartFurnitureHookup,
  ) {
    if (Object.keys(error.keyPattern)[0] === "name")
      throw new SFHNameConflictError(smartFurnitureHookup.name);

    if (Object.keys(error.keyPattern)[0] === "endpoint")
      throw new SFHEndpointConflictError(smartFurnitureHookup.endpoint);
  }

  async addSmartFurnitureHookup(
    smartFurnitureHookup: SmartFurnitureHookup,
  ): Promise<SmartFurnitureHookup> {
    const id = uuidv4();

    const smartFurnitureHookupDocument = new SmartFurnitureHookupModel({
      _id: id,
      name: smartFurnitureHookup.name,
      consumptionType: smartFurnitureHookup.consumption.type,
      consumptionUnit: smartFurnitureHookup.consumption.unit,
      endpoint: smartFurnitureHookup.endpoint,
    });

    try {
      return this.mapSmartFurnitureHookupDocumentToDomain(
        await smartFurnitureHookupDocument.save(),
      );
    } catch (error) {
      if ((error as MongoServerError).code != 11000) {
        this.handleSmartFurnitureHookupConflict(
          error as MongoServerError,
          smartFurnitureHookup,
        );
      }

      throw error;
    }
  }

  async findAllSmartFurnitureHookup(): Promise<SmartFurnitureHookup[]> {
    const smartFurnitureHookupDocuments = await SmartFurnitureHookupModel.find()
      .lean()
      .exec();

    return smartFurnitureHookupDocuments.map((doc) =>
      this.mapSmartFurnitureHookupDocumentToDomain(doc),
    );
  }

  async findSmartFurnitureHookupByID(
    id: SmartFurnitureHookupID,
  ): Promise<SmartFurnitureHookup | null> {
    this.validateSmartFurnitureHookupID(id.value);

    const smartFurnitureHookupDocument =
      await SmartFurnitureHookupModel.findById(id.value).lean().exec();

    if (!smartFurnitureHookupDocument) {
      return null;
    }

    return this.mapSmartFurnitureHookupDocumentToDomain(
      smartFurnitureHookupDocument,
    );
  }

  async removeSmartFurnitureHookup(
    smartFurnitureHookup: SmartFurnitureHookup,
  ): Promise<void> {
    const result = await SmartFurnitureHookupModel.findByIdAndDelete(
      smartFurnitureHookup.id.value,
    ).exec();

    if (!result) {
      throw new SmartFurnitureHookupNotFoundError();
    }
  }

  async updateSmartFurnitureHookup(
    smartFurnitureHookup: SmartFurnitureHookup,
  ): Promise<SmartFurnitureHookup> {
    this.validateSmartFurnitureHookupID(smartFurnitureHookup.id.value);

    try {
      const updatedDoc = await SmartFurnitureHookupModel.findByIdAndUpdate(
        smartFurnitureHookup.id.value,
        {
          name: smartFurnitureHookup.name,
          endpoint: smartFurnitureHookup.endpoint,
        },
        { new: true, runValidators: true },
      ).exec();

      if (!updatedDoc) {
        throw new Error("Cannot update smart furniture hookup");
      }

      return this.mapSmartFurnitureHookupDocumentToDomain(updatedDoc);
    } catch (error) {
      if ((error as MongoServerError).code != 11000) {
        this.handleSmartFurnitureHookupConflict(
          error as MongoServerError,
          smartFurnitureHookup,
        );
      }

      console.log(error);
      throw error;
    }
  }

  private mapSmartFurnitureHookupDocumentToDomain(
    document: SmartFurnitureHookupDocument,
  ): SmartFurnitureHookup {
    const consumption: Consumption = {
      type: consumptionTypeFromString(document.consumptionType),
      unit: consumptionUnitFromString(document.consumptionUnit),
    };

    return {
      id: { value: document._id },
      name: document.name,
      consumption: consumption,
      endpoint: document.endpoint,
    };
  }

  private validateSmartFurnitureHookupID(value: string) {
    if (!validate(value)) {
      throw new Error(`Invalid smart furniture hookup ID format: ${value}`);
    }
  }
}
