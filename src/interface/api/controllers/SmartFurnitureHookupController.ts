import { type Request, type Response } from "express";
import { SmartFurnitureHookupService } from "../../../domain/ports/SmartFurnitureHookupService";
import { smartFurnitureHookupDTOMapper } from "../../../presentation/SmartFurnitureHookupDTO";
import {
  InvalidConsumptionTypeError,
  SFHEndpointConflictError,
  SFHNameConflictError,
  SmartFurnitureHookupNotFoundError,
} from "../../../domain/errors/errors";
import { SmartFurnitureHookupNotFound } from "../errors/errors";
import jwt from "jsonwebtoken";

export class SmartFurnitureHookupController {
  constructor(private readonly sfhService: SmartFurnitureHookupService) {}

  getSmartFurnitureHookups = async (
    request: Request,
    response: Response,
  ): Promise<Response> => {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader?.startsWith("Bearer ")) {
        return response.status(401).json({ error: "Access token is required" });
      }

      const token = authHeader.split(" ")[1];

      const x = jwt.verify(token, "your-secret-key");

      const sfhs = await this.sfhService.getSmartFurnitureHookups();

      return response.json({
        x: x,
        smartFurnitureHookups: sfhs.map((sfh) =>
          smartFurnitureHookupDTOMapper.toDTO(sfh),
        ),
      });
    } catch {
      return response.status(500).send();
    }
  };

  getSmartFurnitureHookup = async (
    request: Request,
    response: Response,
  ): Promise<Response> => {
    const { id } = request.params;

    const sfh = await this.sfhService.getSFH({ value: id });

    if (!sfh) {
      return response.status(404).json(SmartFurnitureHookupNotFound);
    }

    return response.json(smartFurnitureHookupDTOMapper.toDTO(sfh));
  };

  createSFH = async (
    request: Request,
    response: Response,
  ): Promise<Response> => {
    try {
      if (!request.body) {
        return response.status(400).json({ error: "Request body is missing" });
      }

      const { name, type, endpoint } = request.body;

      if (!name || !type || !endpoint) {
        return response
          .status(400)
          .json({ error: "name, type and endpoint are required" });
      }

      const sfh = await this.sfhService.createSFH(name, type, endpoint);

      return response
        .status(201)
        .json(smartFurnitureHookupDTOMapper.toDTO(sfh));
    } catch (error) {
      if (error instanceof InvalidConsumptionTypeError) {
        return response.status(400).json({ error: error.message });
      }

      if (error instanceof SFHNameConflictError) {
        return response.status(409).json({ error: error.message });
      }

      if (error instanceof SFHEndpointConflictError) {
        return response.status(409).json({ error: error.message });
      }

      return response.status(500).send();
    }
  };

  updateSFH = async (
    request: Request,
    response: Response,
  ): Promise<Response> => {
    try {
      const { id } = request.params;

      if (!request.body) {
        return response.status(400).json({ error: "Request body is missing" });
      }

      const { name, endpoint } = request.body;

      if (!name && !endpoint) {
        return response
          .status(400)
          .json({ error: "update at least one param" });
      }

      const sfh = await this.sfhService.updateSFH(
        { value: id },
        name,
        endpoint,
      );

      return response
        .status(201)
        .json(smartFurnitureHookupDTOMapper.toDTO(sfh));
    } catch (error) {
      if (error instanceof SmartFurnitureHookupNotFoundError) {
        return response.status(404).json({ message: error.message });
      }

      if (
        error instanceof SFHNameConflictError ||
        error instanceof SFHEndpointConflictError
      ) {
        return response.status(409).json({ message: error.message });
      }

      console.log(error);

      return response.status(500).send();
    }
  };

  deleteSFH = async (
    request: Request,
    response: Response,
  ): Promise<Response> => {
    try {
      const { id } = request.params;
      await this.sfhService.deleteSFH({ value: id });

      return response
        .status(204)
        .json({ message: "Smart furniture hookup deleted successfully" });
    } catch (error) {
      if (error instanceof SmartFurnitureHookupNotFoundError) {
        return response.status(404).json({ message: error.message });
      }

      return response.status(500).send();
    }
  };
}
