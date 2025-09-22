import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { v4 as uuidv4 } from "uuid";

import { smartFurnitureHookupRepository } from "../dependencies";
import {
  mockSmartFridge,
  mockSmartFurnitureHookupElectricity,
  mockSmartFurnitureHookupGas,
  mockSmartFurnitureHookupWater,
} from "../../storage/mockupSFH";
import { SmartFurnitureHookup } from "../../../domain/SmartFurnitureHookup";
import { app } from "./app";
import { ConsumptionType } from "../../../domain/ConsumptionType";
import { SmartFurnitureHookupID } from "../../../domain/SmartFurnitureHookupID";

describe("Smart Furniture Hookup API", () => {
  const url = "/api/smart-furniture-hookups";

  let smartFridge: SmartFurnitureHookup;
  let smartLamp: SmartFurnitureHookup;

  beforeAll(async () => {
    smartFridge =
      await smartFurnitureHookupRepository.addSmartFurnitureHookup(
        mockSmartFridge,
      );
    smartLamp = await smartFurnitureHookupRepository.addSmartFurnitureHookup(
      mockSmartFurnitureHookupElectricity,
    );
  });

  describe("GET / - List of sfhs", () => {
    const getAllRequest = async () => request(app).get(url);

    it("should return sfh list when requested ", async () => {
      const response = await getAllRequest();

      expect(response.status).toBe(200);

      const names = response.body["smartFurnitureHookups"]
        .map((sfh: SmartFurnitureHookup) => sfh.name)
        .sort();

      expect(names).toEqual([smartFridge.name, smartLamp.name].sort());
    });
  });

  describe("GET /:id - Retrieve a smart furniture hookup", () => {
    const getByIDRequest = async (id: SmartFurnitureHookupID) =>
      request(app).get(url + "/" + id.value);

    it("should allow to get a smart furniture hookup by giving an existing id", async () => {
      const response = await getByIDRequest(smartFridge.id);

      expect(response.status).toBe(200);
      expect(response.body["id"]).toBe(smartFridge.id.value);
      expect(response.body["name"]).toBe(smartFridge.name);
      expect(response.body["type"].toLowerCase()).toBe(
        smartFridge.consumption.type.toLowerCase(),
      );
      expect(response.body["consumptionUnit"]).toBe(
        smartFridge.consumption.unit,
      );
      expect(response.body["endpoint"]).toBe(smartFridge.endpoint);
    });

    it("should return 404 when smart furniture hookup doesn't exists", async () => {
      const response = await getByIDRequest({ value: uuidv4() });

      expect(response.status).toBe(404);
    });
  });

  describe("POST / - Create sfh", () => {
    const createNewSmartFurnitureHookupRequest = async (sfh?: {
      name?: string;
      type?: ConsumptionType;
      endpoint?: string;
    }) => {
      return request(app).post(url).send(sfh);
    };

    it("should create sfh when provided valid name, type and endpoint", async () => {
      const newSmartFurnitureHookup: SmartFurnitureHookup =
        mockSmartFurnitureHookupWater;

      const response = await createNewSmartFurnitureHookupRequest({
        ...newSmartFurnitureHookup,
        type: newSmartFurnitureHookup.consumption.type,
      });

      expect(response.status).toBe(201);

      expect(response.body["name"]).toBe(newSmartFurnitureHookup.name);
      expect(response.body["type"].toLowerCase()).toBe(
        newSmartFurnitureHookup.consumption.type.toLowerCase(),
      );
      expect(response.body["consumptionUnit"].toLowerCase()).toBe(
        newSmartFurnitureHookup.consumption.unit.toLowerCase(),
      );
      expect(response.body["endpoint"]).toBe(
        newSmartFurnitureHookup.endpoint.toLowerCase(),
      );

      await smartFurnitureHookupRepository.removeSmartFurnitureHookup({
        ...newSmartFurnitureHookup,
        id: { value: response.body["id"] },
      });
    });

    it("should return 400 status code when no data is provided", async () => {
      const response = await createNewSmartFurnitureHookupRequest(undefined);

      expect(response.status).toBe(400);
    });

    it("should return 400 status code when required data are not provided", async () => {
      const newSmartFurnitureHookup: SmartFurnitureHookup =
        mockSmartFurnitureHookupWater;

      const responseName = await createNewSmartFurnitureHookupRequest({
        name: undefined,
        type: newSmartFurnitureHookup.consumption.type,
        endpoint: newSmartFurnitureHookup.endpoint,
      });

      const responseType = await createNewSmartFurnitureHookupRequest({
        name: newSmartFurnitureHookup.name,
        type: undefined,
        endpoint: newSmartFurnitureHookup.endpoint,
      });
      const responseEndpoint = await createNewSmartFurnitureHookupRequest({
        name: newSmartFurnitureHookup.name,
        type: newSmartFurnitureHookup.consumption.type,
        endpoint: undefined,
      });

      expect(responseName.status).toBe(400);
      expect(responseType.status).toBe(400);
      expect(responseEndpoint.status).toBe(400);
    });

    // it("should return 401 when no authentication is provided", async () => {
    //   const response = await createNewHouseholdUserRequest(
    //     mockHouseholdUserEmma,
    //   );
    //
    //   expect(response.status).toBe(401);
    // });
    //
    // it("should return 403 when household user tries to create account", async () => {
    //   const response = await createNewHouseholdUserRequest(
    //     mockHouseholdUserEmma,
    //     markAccessToken,
    //   );
    //
    //   expect(response.status).toBe(403);
    // });

    it("should return 409 when name or endpoint are already exists", async () => {
      const responseName = await createNewSmartFurnitureHookupRequest({
        ...smartFridge,
        type: smartFridge.consumption.type,
      });

      const responseEndpoint = await createNewSmartFurnitureHookupRequest({
        name: "hookup",
        type: ConsumptionType.ELECTRICITY,
        endpoint: smartFridge.endpoint,
      });

      console.log(responseName.body);
      console.log(responseEndpoint.body);
      expect(responseName.status).toBe(409);
      expect(responseEndpoint.status).toBe(409);
    });
  });

  describe("PATCH /:id/username - Update smart furniture hookup information", () => {
    const updateSmartFurnitureHookupRequest = async (
      id: SmartFurnitureHookupID,
      sfh?: { name?: string; endpoint?: string },
    ) =>
      request(app)
        .patch(url + "/" + id.value)
        .send(sfh);

    it("should allow to update information of an existing smart furniture hookup", async () => {
      const newSFH =
        await smartFurnitureHookupRepository.addSmartFurnitureHookup(
          mockSmartFurnitureHookupWater,
        );
      const newName = "Smart Kitchen Sink";
      const newEndpoint = "192.168.0.10:5999";

      const response = await updateSmartFurnitureHookupRequest(newSFH.id, {
        name: newName,
        endpoint: newEndpoint,
      });

      expect(response.status).toBe(201);
      expect(response.body["name"]).toBe(newName);
      expect(response.body["endpoint"]).toBe(newEndpoint);

      await smartFurnitureHookupRepository.removeSmartFurnitureHookup(newSFH);
    });

    it("should allow to update partial information of an existing smart furniture hookup", async () => {
      const newWaterSFH =
        await smartFurnitureHookupRepository.addSmartFurnitureHookup(
          mockSmartFurnitureHookupWater,
        );
      const newGasSFH =
        await smartFurnitureHookupRepository.addSmartFurnitureHookup(
          mockSmartFurnitureHookupGas,
        );
      const newName = "Smart Kitchen Sink";
      const newEndpoint = "192.168.0.10:5999";

      const responseWaterSFH = await updateSmartFurnitureHookupRequest(
        newWaterSFH.id,
        { name: newName, endpoint: undefined },
      );

      const responseGasSFH = await updateSmartFurnitureHookupRequest(
        newGasSFH.id,
        { name: undefined, endpoint: newEndpoint },
      );

      expect(responseWaterSFH.status).toBe(201);
      expect(responseWaterSFH.body["name"]).toBe(newName);
      expect(responseWaterSFH.body["endpoint"]).toBe(newWaterSFH.endpoint);

      expect(responseGasSFH.status).toBe(201);
      expect(responseGasSFH.body["name"]).toBe(newGasSFH.name);
      expect(responseGasSFH.body["endpoint"]).toBe(newEndpoint);

      await smartFurnitureHookupRepository.removeSmartFurnitureHookup(
        newWaterSFH,
      );
      await smartFurnitureHookupRepository.removeSmartFurnitureHookup(
        newGasSFH,
      );
    });

    it("should return 400 status code when no data is provided", async () => {
      const response = await updateSmartFurnitureHookupRequest(
        smartFridge.id,
        {},
      );

      expect(response.status).toBe(400);
    });

    it("should return 404 when smart furniture hookup doesn't exists", async () => {
      const response = await updateSmartFurnitureHookupRequest(
        { value: uuidv4() },
        { name: "Smart Kitchen Fridge" },
      );

      expect(response.status).toBe(404);
    });

    it("should return 409 when trying to use existing name or endpoint", async () => {
      const newSFH =
        await smartFurnitureHookupRepository.addSmartFurnitureHookup(
          mockSmartFurnitureHookupWater,
        );

      const response = await updateSmartFurnitureHookupRequest(newSFH.id, {
        name: smartFridge.name,
      });

      const response2 = await updateSmartFurnitureHookupRequest(newSFH.id, {
        endpoint: smartFridge.endpoint,
      });

      expect(response.status).toBe(409);
      expect(response2.status).toBe(409);

      await smartFurnitureHookupRepository.removeSmartFurnitureHookup(newSFH);
    });
  });

  describe("DELETE /:id/ - Deletes a smart furniture hookup", () => {
    const deleteRequest = async (id: SmartFurnitureHookupID) =>
      request(app).delete(url + "/" + id.value);

    it("should allow to delete a smart furniture hookup", async () => {
      const newSFH =
        await smartFurnitureHookupRepository.addSmartFurnitureHookup(
          mockSmartFurnitureHookupWater,
        );

      const response = await deleteRequest(newSFH.id);

      expect(response.status).toBe(204);
    });

    it("should return 404 when smart furniture hookup doesn't exists", async () => {
      const response = await deleteRequest({ value: uuidv4() });

      expect(response.status).toBe(404);
    });
  });
});
