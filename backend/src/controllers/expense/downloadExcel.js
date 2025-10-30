import XLSX from "xlsx";

const downloadExpenseExcel = async (req, res) => {
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

export default downloadExpenseExcel;
