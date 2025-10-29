import Income from "../../models/income.js";
import Expense from "../../models/expense.js";
import { isValidObjectId, Types } from "mongoose";

// Dashboard Data
export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjectId = new Types.ObjectId(String(userId));

    // Fetch total income & expenses
    const totalIncome = await Income.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalExpense = await Expense.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Get income transactions in the last 60 days
    const last60DaysIncomeTransactions = await Income.find({
      userId,
      date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    // Get total income for last 60 days
    const incomeLast60Days = last60DaysIncomeTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    // Get expense transactions in the last 30 days
    const last30DaysExpenseTransactions = await Expense.find({
      userId,
      date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    // Get total expenses for last 30 days
    const expensesLast30Days = last30DaysExpenseTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    // Fetch last 5 transactions (income + expenses)
    const lastIncomeTransactions = await Income.find({ userId })
      .sort({ date: -1 })
      .limit(5);

    const lastExpenseTransactions = await Expense.find({ userId })
      .sort({ date: -1 })
      .limit(5);

    const lastTransactions = [
      ...lastIncomeTransactions.map((txn) => ({
        ...txn.toObject(),
        type: "income",
      })),
      ...lastExpenseTransactions.map((txn) => ({
        ...txn.toObject(),
        type: "expense",
      })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort latest first

    // Final Response
    res.json({
      totalBalance:
        (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
      totalIncome: totalIncome[0]?.total || 0,
      totalExpenses: totalExpense[0]?.total || 0,
      last30DaysExpenses: {
        total: expensesLast30Days,
        transactions: last30DaysExpenseTransactions,
      },
      last60DaysIncome: {
        total: incomeLast60Days,
        transactions: last60DaysIncomeTransactions,
      },
      recentTransactions: lastTransactions.slice(0, 10), // Limit to 10 recent transactions
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

export default getDashboardData;
