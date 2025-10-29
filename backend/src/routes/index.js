import { Router } from "express";

// AUTH ROUTES IMPORTS...
import authRoutes from "./auth.js";
import incomeRoutes from "./income.js";
import dashboardRoutes from './dashboard.js'
import authentication from "../middlewares/authentication.js";
import expenseRoutes from './expense.js'

const router = Router();

// Define a simple route for testing
router.get("/", (req, res) => {
  res.send("API is running...");
});

// AUTH ROUTES...
router.use("/auth", authRoutes);

// INCOME ROUTES...
router.use("/income", authentication, incomeRoutes);

// EXPENSE ROUTES
router.use("/expense", authentication, expenseRoutes);

// DASHBOARD ROUTES
router.use("/dashboard", dashboardRoutes);


export default router;
