import Income from "../../models/income.js";
import XLSX from "xlsx";

const downloadIncomeExcel = async (req, res) => {
  const userId = req.user._id; // make sure _id use ho, not id

  try {
    // ✅ Fetch income data as plain JS objects
    const incomes = await Income.find({ userId })
      .sort({ date: -1 })
      .select("source amount date -_id")
      .lean();

    // ✅ Format data for Excel
    const formattedData = incomes.map((item) => ({
      Source: item.source || "N/A",
      Amount: item.amount || 0,
      Date: new Date(item.date).toLocaleDateString("en-PK"),
      Icon: item.icon || "💰",
    }));

    // ✅ Create workbook and sheet
    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Income");

    // ✅ Write workbook to memory buffer (no file system)
    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    // ✅ Set response headers
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=income_details_${Date.now()}.xlsx`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    // ✅ Send buffer directly
    res.send(buffer);
  } catch (error) {
    console.error("Download income Excel error:", error);
    res.status(500).json({ message: "Error generating Excel file" });
  }
};

export default downloadIncomeExcel;
