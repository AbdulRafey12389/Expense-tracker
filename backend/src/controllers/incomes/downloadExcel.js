import Income from "../../models/income.js";
import xlsx from "xlsx";

const downloadIncomeExcel = async (req, res) => {
  const userId = req.user.id;

  try {
    const incomes = await Income.find({ userId }).sort({ date: -1 });

    // Prepare data for Excel
    const data = incomes.map((item) => ({
      Source: item.source,
      Amount: item.amount,
      Date: item.date.toLocaleDateString(),
      Icon: item.icon || "💰",
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Income");

    // Generate filename with timestamp
    const filename = `income_details_${Date.now()}.xlsx`;
    xlsx.writeFile(wb, filename);

    // Download the file
    res.download(filename, (err) => {
      if (err) {
        console.error("Download error:", err);
        return res.status(500).json({ message: "Error downloading file" });
      }

      // Delete the file after download (optional)
      const fs = require("fs");
      fs.unlinkSync(filename);
    });
  } catch (error) {
    console.error("Download income Excel error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export default downloadIncomeExcel;
