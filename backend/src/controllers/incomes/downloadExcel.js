import Income from "../../models/income.js";
import xlsx from "xlsx";

const downloadIncomeExcel = async (req, res) => {
  const userId = req.user.id;

  try {
    // Fetch income data from MongoDB
    const incomes = await Income.find({ userId }).sort({ date: -1 });

    // Prepare data for Excel
    const data = incomes.map((item) => ({
      Source: item.source,
      Amount: item.amount,
      Date: item.date.toLocaleDateString(),
      Icon: item.icon || "💰",
    }));

    // Create a new workbook and sheet
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Income");

    // ✅ Write workbook to memory buffer instead of saving to disk
    const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

    // ✅ Set proper headers for download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=income_details_${Date.now()}.xlsx`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    // ✅ Send the Excel buffer to the client
    res.send(buffer);
  } catch (error) {
    console.error("Download income Excel error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export default downloadIncomeExcel;
