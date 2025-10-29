import Expense from "../../models/expense.js";

// Get all expenses for a user
export const getAllExpenses = async (req, res) => {
  const userId = req.user.id;

  try {
    const expenses = await Expense.find({ userId }).sort({ date: -1 });

    const totalAmount = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    res.status(200).json({
      success: true,
      expenses,
      total: expenses.length,
      totalAmount,
    });
  } catch (error) {
    console.error("Get expenses error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export default getAllExpenses;
