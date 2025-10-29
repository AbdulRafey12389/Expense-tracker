import Expense from "../../models/expense.js";
import xlsx from "xlsx";
import fs from "fs";

const downloadExpenseExcel = async (req, res) => {
  const userId = req.user.id;

  try {
    const expenses = await Expense.find({ userId }).sort({ date: -1 });

    // Prepare data for Excel
    const data = expenses.map((item) => ({
      Category: item.category,
      Amount: item.amount,
      Date: item.date.toLocaleDateString(),
      Icon: item.icon || "💸",
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Expenses");

    // Generate filename with timestamp
    const filename = `expense_details_${Date.now()}.xlsx`;
    xlsx.writeFile(wb, filename);

    // Download the file
    res.download(filename, (err) => {
      if (err) {
        console.error("Download error:", err);
        return res.status(500).json({ message: "Error downloading file" });
      }

      // Delete the file after download
      fs.unlinkSync(filename);
    });
  } catch (error) {
    console.error("Download expense Excel error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export default downloadExpenseExcel;
