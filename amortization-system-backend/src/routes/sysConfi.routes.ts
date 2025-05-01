import { Router } from "express";
import protectRoute from "../middleware/protectRoute.middleware";
import { getConfigSystem } from "../controllers/sysConfi.controllers";

const router = Router();
router.get('/',getConfigSystem);

export default router;