import { Router } from "express";
import { getBanks, updateBank } from "../controllers/bank.controllers";
import upload from "../middleware/multer.middleware";

const router = Router();

router.get("/", getBanks);
router.put("/modBank", upload.single('logo') ,updateBank);

export default router;