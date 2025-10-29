import express from "express";
import addExpense from "../controllers/expense/addExpense.js";
import getAllExpenses from "../controllers/expense/getAllExpense.js";
import deleteExpense from "../controllers/expense/deleteExpenseById.js";
import downloadExpenseExcel from "../controllers/expense/downloadExcel.js";

const router = express.Router();

// Apply routes
router.post("/add", addExpense);
router.get("/get", getAllExpenses);
router.get("/download-excel", downloadExpenseExcel);
router.delete("/:id", deleteExpense);

export default router;
