import { Router } from "express";

// CONTROLLERS...
import addIncome from "../controllers/incomes/addIncome.js";
import getAllIncome from "../controllers/incomes/getAllIncome.js";
import deleteIncomeById from "../controllers/incomes/deleteIncomeById.js";
import downloadIncomeExcel from "../controllers/incomes/downloadExcel.js";

// MIDDLEWARES...
import authentication from "../middlewares/authentication.js";

const router = Router();

router.post("/add", addIncome);
router.get("/get", getAllIncome);
router.get("/download-excel", downloadIncomeExcel);
router.delete("/:id", deleteIncomeById);

export default router;
