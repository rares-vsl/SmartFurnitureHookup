import { SmartFurnitureHookupController } from "../controllers/SmartFurnitureHookupController";
import { Router } from "express";
import { smartFurnitureHookupRoutes } from "./smartFurnitureHookup";

export function router(
  smartFurnitureHookupController: SmartFurnitureHookupController,
): Router {
  const router = Router();

  router.use(
    "/api/smart-furniture-hookups",
    smartFurnitureHookupRoutes(smartFurnitureHookupController),
  );

  return router;
}
