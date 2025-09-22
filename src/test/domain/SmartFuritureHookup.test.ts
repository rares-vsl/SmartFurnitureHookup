import { beforeAll, describe, expect, it } from "vitest";
import { SmartFurnitureHookupFactory } from "../../domain/SmartFurnitureHookupFactory";
import { ConsumptionType } from "../../domain/ConsumptionType";
import { ConsumptionUnit } from "../../domain/ConsumptionUnit";

describe("Smart furniture hookup Factory", () => {
  let factory: SmartFurnitureHookupFactory;

  beforeAll(() => {
    factory = new SmartFurnitureHookupFactory();
  });

  it("should create a gas type of SFH", () => {
    const gasSFH = factory.createSmartFurnitureHookup(
      "Caldaia",
      ConsumptionType.GAS,
      "caldaia.it",
    );

    expect(gasSFH.consumption.type).toBe(ConsumptionType.GAS);
    expect(gasSFH.consumption.unit).toBe(ConsumptionUnit.CUBIC_METER);
  });

  it("should create a water type of SFH", () => {
    const gasSFH = factory.createSmartFurnitureHookup(
      "Lavello",
      ConsumptionType.WATER,
      "lavello.it",
    );

    expect(gasSFH.consumption.type).toBe(ConsumptionType.WATER);
    expect(gasSFH.consumption.unit).toBe(ConsumptionUnit.LITER);
  });

  it("should create a electric type of SFH", () => {
    const gasSFH = factory.createSmartFurnitureHookup(
      "lamp",
      ConsumptionType.ELECTRICITY,
      "lamp.it",
    );

    expect(gasSFH.consumption.type).toBe(ConsumptionType.ELECTRICITY);
    expect(gasSFH.consumption.unit).toBe(ConsumptionUnit.KILOWATT_HOUR);
  });
});
