import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { SmartFurnitureHookupService } from "../../domain/ports/SmartFurnitureHookupService";
import { InMemorySmartFurnitureHookupRepository } from "../storage/InMemorySmartFurnitureHookupRepository";
import { SmartFurnitureHookupServiceImpl } from "../../application/SmartFurnitureHookupServiceImpl";
import {
  mockSmartFridge,
  mockSmartFurnitureHookupElectricity,
  mockSmartFurnitureHookupGas,
  mockSmartFurnitureHookupWater,
} from "../storage/mockupSFH";
import { SmartFurnitureHookup } from "../../domain/SmartFurnitureHookup";

import { v4 as uuidv4 } from "uuid";
import {
  SFHEndpointConflictError,
  SFHNameConflictError,
  SmartFurnitureHookupNotFoundError,
} from "../../domain/errors/errors";

describe("SmartFurnitureHookupService", () => {
  let repository: InMemorySmartFurnitureHookupRepository;
  let smartFurnitureHookupService: SmartFurnitureHookupService;

  beforeAll(() => {
    repository = new InMemorySmartFurnitureHookupRepository();
    smartFurnitureHookupService = new SmartFurnitureHookupServiceImpl(
      repository,
    );
  });

  describe("createSFH", () => {
    beforeEach(() => {
      repository.clear();
    });

    it("should add new sfh to the repository", async () => {
      const sfh = mockSmartFurnitureHookupElectricity;

      const result = await smartFurnitureHookupService.createSFH(
        sfh.name,
        sfh.consumption.type,
        sfh.endpoint,
      );
      expect(result.id.value).not.toBe("");
      expect(result.name, sfh.name);
      expect(result.consumption.type).toBe(sfh.consumption.type);
      expect(result.consumption.unit).toBe(sfh.consumption.unit);
    });
  });

  describe("getSmartFurnitureHookups", () => {
    beforeEach(() => {
      repository.clear();
    });

    it("should return the household users from the repository", async () => {
      await repository.addSmartFurnitureHookup(mockSmartFurnitureHookupGas);
      await repository.addSmartFurnitureHookup(mockSmartFurnitureHookupWater);
      await repository.addSmartFurnitureHookup(
        mockSmartFurnitureHookupElectricity,
      );

      const result =
        await smartFurnitureHookupService.getSmartFurnitureHookups();

      expect(result).toHaveLength(repository.length());
    });
  });

  describe("getSFH", () => {
    let sfh: SmartFurnitureHookup;

    beforeEach(async () => {
      repository.clear();
      sfh = await repository.addSmartFurnitureHookup(
        mockSmartFurnitureHookupElectricity,
      );
    });

    it("should return sfh when valid ID exist", async () => {
      const result = await smartFurnitureHookupService.getSFH(sfh.id);

      expect(result).not.toBeNull();
      expect(result?.name).toBe(sfh.name);
    });

    it("should return null when ID does not exist", async () => {
      const result = await smartFurnitureHookupService.getSFH({
        value: uuidv4(),
      });
      expect(result).toBeNull();
    });
  });

  describe("updateSFH", () => {
    let sfh: SmartFurnitureHookup;

    beforeEach(async () => {
      repository.clear();

      sfh = await repository.addSmartFurnitureHookup(
        mockSmartFurnitureHookupElectricity,
      );
    });

    it("should update sfh name successfully", async () => {
      const newName = "Smart Fridge";
      const result = await smartFurnitureHookupService.updateSFH(
        sfh.id,
        newName,
        sfh.endpoint,
      );

      expect(result.id).toBe(sfh.id);
      expect(result.name).toBe(newName);
      expect(result.endpoint).toBe(sfh.endpoint);
    });

    it("should update sfh name successfully", async () => {
      const newEndpoint = "192.168.0.10:5004";

      const result = await smartFurnitureHookupService.updateSFH(
        sfh.id,
        sfh.name,
        newEndpoint,
      );

      expect(result.id).toBe(sfh.id);
      expect(result.name).toBe(sfh.name);
      expect(result.endpoint).toBe(newEndpoint);
    });

    it("should throw error when sfh not found", async () => {
      await expect(
        smartFurnitureHookupService.updateSFH(
          { value: uuidv4() },
          "name",
          "endpoint",
        ),
      ).rejects.toThrow(SmartFurnitureHookupNotFoundError);
    });

    it("should throw SFHNameConflictError when new username conflicts", async () => {
      const newSFH = await repository.addSmartFurnitureHookup(mockSmartFridge);

      await expect(
        smartFurnitureHookupService.updateSFH(
          sfh.id,
          newSFH.name,
          sfh.endpoint,
        ),
      ).rejects.toThrow(SFHNameConflictError);
    });

    it("should throw ConflictError when new username conflicts", async () => {
      const newSFH = await repository.addSmartFurnitureHookup(mockSmartFridge);

      await expect(
        smartFurnitureHookupService.updateSFH(
          sfh.id,
          sfh.name,
          newSFH.endpoint,
        ),
      ).rejects.toThrow(SFHEndpointConflictError);
    });
  });

  describe("deleteSFH", () => {
    let sfh: SmartFurnitureHookup;

    beforeEach(async () => {
      repository.clear();

      sfh = await repository.addSmartFurnitureHookup(
        mockSmartFurnitureHookupElectricity,
      );
    });

    it("should delete sfh successfully", async () => {
      await smartFurnitureHookupService.deleteSFH(sfh.id);

      const result = await repository.findSmartFurnitureHookupByID(sfh.id);
      expect(result).toBeNull();
    });

    it("should throw error when user not found", async () => {
      await expect(
        smartFurnitureHookupService.deleteSFH({ value: uuidv4() }),
      ).rejects.toThrow(SmartFurnitureHookupNotFoundError);
    });
  });
});
