import Expense from "../../models/expense.js";

// Delete expense
export const deleteExpense = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const expense = await Expense.findOneAndDelete({ _id: id, userId });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error("Delete expense error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export default deleteExpense;
