import { Router } from "express";
import protectRoute from "../middleware/protectRoute.middleware";
import { getConfigSystem, updateConfigSystem } from "../controllers/sysConfi.controllers";

const router = Router();
router.get('/',getConfigSystem);
router.put('/updateConfig', updateConfigSystem);

export default router;