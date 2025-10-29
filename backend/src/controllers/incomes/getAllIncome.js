import Income from "../../models/income.js";

export const getAllIncome = async (req, res) => {
  const userId = req.user.id;

  try {
    const incomes = await Income.find({ userId }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      incomes,
      total: incomes.length,
    });
  } catch (error) {
    console.error("Get incomes error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export default getAllIncome;
