import Expense from "../../models/expense.js";

// Add Expense
export const addExpense = async (req, res) => {
  const userId = req.user.id;

  try {
    const { icon, category, amount, date } = req.body;

    // Validation
    if (!icon || !category || !amount) {
      return res.status(400).json({
        success: false,
        message: "Icon, category and amount are required",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    const newExpense = new Expense({
      userId,
      icon,
      category,
      amount,
      date: date ? new Date(date) : new Date(),
    });

    await newExpense.save();

    res.status(201).json({
      success: true,
      message: "Expense added successfully",
      expense: newExpense,
    });
  } catch (error) {
    console.error("Add expense error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export default addExpense;
