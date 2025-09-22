// ===== Repository =====
import { SmartFurnitureHookupServiceImpl } from "../../application/SmartFurnitureHookupServiceImpl";
import { SmartFurnitureHookupController } from "./controllers/SmartFurnitureHookupController";
import { router } from "./routes/router";
import { MongooseSmartFurnitureHookupRepository } from "../../storage/mongo/MongooseSmartFurnitureHookupRepository";

const smartFurnitureHookupRepository =
  new MongooseSmartFurnitureHookupRepository();

// ===== Services =====
export const smartFurnitureHookupService = new SmartFurnitureHookupServiceImpl(
  smartFurnitureHookupRepository,
);

// ===== Controllers =====
export const smartFurnitureHookupController =
  new SmartFurnitureHookupController(smartFurnitureHookupService);

// ===== Router =====
export const apiRouter = router(smartFurnitureHookupController);
