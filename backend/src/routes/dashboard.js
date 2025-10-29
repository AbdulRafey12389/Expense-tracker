import { Router } from "express";

// CONTROLLERS...
import getDashBoardData from "../controllers/dashboard/getDashboardData.js";

// MIDDLEWARES...
import authentication from "../middlewares/authentication.js";

const router = Router();

router.get("/get", authentication, getDashBoardData);

export default router;
