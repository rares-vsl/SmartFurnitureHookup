import { Router } from "express";
import { SmartFurnitureHookupController } from "../controllers/SmartFurnitureHookupController";

export function smartFurnitureHookupRoutes(
  smartFurnitureHookupController: SmartFurnitureHookupController,
): Router {
  const router = Router();

  router.post("/", smartFurnitureHookupController.createSFH);
  router.get("/", smartFurnitureHookupController.getSmartFurnitureHookups);
  router.get("/:id", smartFurnitureHookupController.getSmartFurnitureHookup);
  router.patch("/:id", smartFurnitureHookupController.updateSFH);
  router.delete("/:id", smartFurnitureHookupController.deleteSFH);

  return router;
}
