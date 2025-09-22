import { SmartFurnitureHookupFactory } from "../../domain/SmartFurnitureHookupFactory";
import { ConsumptionType } from "../../domain/ConsumptionType";

const hookupFactory = new SmartFurnitureHookupFactory();

export const mockSmartFurnitureHookupWater =
  hookupFactory.createSmartFurnitureHookup(
    "Smart Sink",
    ConsumptionType.WATER,
    "192.168.0.10:5001",
  );

export const mockSmartFurnitureHookupGas =
  hookupFactory.createSmartFurnitureHookup(
    "Smart Stove",
    ConsumptionType.GAS,
    "192.168.0.10:5002",
  );

export const mockSmartFurnitureHookupElectricity =
  hookupFactory.createSmartFurnitureHookup(
    "Smart Lamp",
    ConsumptionType.ELECTRICITY,
    "192.168.0.10:5003",
  );

export const mockSmartFridge = hookupFactory.createSmartFurnitureHookup(
  "Smart Fridge",
  ConsumptionType.ELECTRICITY,
  "192.168.0.10:5004",
);
