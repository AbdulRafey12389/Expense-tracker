import Income from "../../models/income.js";

// Add Income Source
export const addIncome = async (req, res) => {
  const userId = req.user.id;

  try {
    const { icon, source, amount, date } = req.body;

    // Validation: Check for missing fields
    if (!source || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    const newIncome = new Income({
      userId,
      icon: icon || "💰",
      source,
      amount,
      date: new Date(date),
    });

    await newIncome.save();

    res.status(201).json({
      success: true,
      message: "Income added successfully",
      income: newIncome,
    });
  } catch (error) {
    console.error("Add income error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export default addIncome;
