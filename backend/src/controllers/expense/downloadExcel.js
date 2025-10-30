import Expense from "../../models/expense.js";
import XLSX from "xlsx";

const downloadExpenseExcel = async (req, res) => {
  const userId = req.user._id;

  try {
    // ✅ Convert documents to plain objects
    const expenses = await Expense.find({ userId })
      .select("category amount date -_id")
      .lean(); // <-- This makes them plain JS objects

    // ✅ Format data for Excel
    const formattedData = expenses.map((item) => ({
      Category: item.category || "N/A",
      Amount: item.amount || 0,
      Date: new Date(item.date).toLocaleDateString("en-PK"), // readable date
    }));

    // ✅ Create workbook & sheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

    // ✅ Write to buffer (no file system)
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    // ✅ Set headers and send
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=expense_details.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer);
  } catch (error) {
    console.error("Error generating Excel:", error);
    res.status(500).json({ message: "Error generating Excel file" });
  }
};

export default downloadExpenseExcel;
