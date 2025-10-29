import Income from "../../models/income.js";

// Delete income
export const deleteIncomeById = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const income = await Income.findOneAndDelete({ _id: id, userId });

    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }

    res.status(200).json({
      success: true,
      message: "Income deleted successfully",
    });
  } catch (error) {
    console.error("Delete income error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export default deleteIncomeById;
