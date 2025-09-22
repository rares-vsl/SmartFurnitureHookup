// ===== Repository =====
import { InMemorySmartFurnitureHookupRepository } from "../storage/InMemorySmartFurnitureHookupRepository";
import { SmartFurnitureHookupServiceImpl } from "../../application/SmartFurnitureHookupServiceImpl";
import { SmartFurnitureHookupController } from "../../interface/api/controllers/SmartFurnitureHookupController";
import { router } from "../../interface/api/routes/router";

export const smartFurnitureHookupRepository =
  new InMemorySmartFurnitureHookupRepository();

// ===== Services =====
export const smartFurnitureHookupService = new SmartFurnitureHookupServiceImpl(
  smartFurnitureHookupRepository,
);

// ===== Controllers =====
export const smartFurnitureHookupController =
  new SmartFurnitureHookupController(smartFurnitureHookupService);

// ===== Router =====
export const apiRouter = router(smartFurnitureHookupController);
