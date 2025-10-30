import XLSX from "xlsx";

export const downloadExpenseExcel = async (req, res) => {
  try {
    // Suppose you fetched data from MongoDB
    const expenses = [
      { title: "Food", amount: 200, date: "2025-10-30" },
      { title: "Transport", amount: 100, date: "2025-10-29" },
    ];

    // 1️⃣ Create a worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(expenses);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

    // 2️⃣ Write workbook to memory (no file)
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    // 3️⃣ Send as downloadable response
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=expense_details.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer); // ✅ works perfectly on Vercel
  } catch (error) {
    console.error("Error generating Excel:", error);
    res.status(500).json({ message: "Error generating Excel file" });
  }
};

// import Income from "../../models/income.js";
// import xlsx from "xlsx";

// import fs from "fs";

// const downloadIncomeExcel = async (req, res) => {
//   const userId = req.user.id;

//   try {
//     const incomes = await Income.find({ userId }).sort({ date: -1 });

//     // Prepare data for Excel
//     const data = incomes.map((item) => ({
//       Source: item.source,
//       Amount: item.amount,
//       Date: item.date.toLocaleDateString(),
//       Icon: item.icon || "💰",
//     }));

//     const wb = xlsx.utils.book_new();
//     const ws = xlsx.utils.json_to_sheet(data);
//     xlsx.utils.book_append_sheet(wb, ws, "Income");

//     // Generate filename with timestamp
//     const filename = `income_details_${Date.now()}.xlsx`;
//     xlsx.writeFile(wb, filename);

//     // Download the file
//     res.download(filename, (err) => {
//       if (err) {
//         console.error("Download error:", err);
//         return res.status(500).json({ message: "Error downloading file" });
//       }

//       // Delete the file after download (optional)

//       fs.unlinkSync(filename);
//     });
//   } catch (error) {
//     console.error("Download income Excel error:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// export default downloadIncomeExcel;
