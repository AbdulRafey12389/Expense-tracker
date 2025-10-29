import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.EXPENSE.GET_ALL_EXPENSE
      );
      setExpenses(response.data.expenses || []);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete Expense Functionality
  const handleDelete = async (expenseId) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(expenseId));
        // Remove the deleted expense from state
        setExpenses((prev) =>
          prev.filter((expense) => expense._id !== expenseId)
        );
      } catch (error) {
        console.error("Error deleting expense:", error);
        alert("Error deleting expense. Please try again.");
      }
    }
  };

  const handleDownloadExcel = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.EXPENSE.DOWNLOAD_EXPENSE,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading Excel:", error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const suffix =
      day === 1 ? "st" : day === 2 ? "nd" : day === 3 ? "rd" : "th";
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const year = date.getFullYear();
    return `${day}${suffix} ${month} ${year}`;
  };

  // Sample data for chart dates (like in your image)
  const chartDates = [
    "2nd Jan",
    "3rd Jan",
    "4th Jan",
    "5th Jan",
    "6th Jan",
    "7th Jan",
    "8th Jan",
    "9th Jan",
    "10th Jan",
    "11th Jan",
    "12th Jan",
    "14th Jan",
    "15th Feb",
    "16th Feb",
    "17th Feb",
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Expense Tracker
        </h1>
        <h2 className="text-2xl font-semibold text-gray-700">
          Expense Overview
        </h2>
        <p className="text-gray-600 mt-2">
          Track your spending trends over time and gain insights into where your
          money goes.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          + Add Expense
        </button>
        <button
          onClick={handleDownloadExcel}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          📥 Download Excel
        </button>
      </div>

      {showAddForm ? (
        <AddExpenseForm
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            setShowAddForm(false);
            fetchExpenses();
          }}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Chart and Expenses */}
          <div className="space-y-6">
            {/* Chart Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Expense Trend
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Track your spending patterns
                  </p>
                </div>
              </div>

              {/* Chart Placeholder with dates like image */}
              <div className="h-64 relative">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-500">
                  <span>14000</span>
                  <span>10500</span>
                  <span>7000</span>
                  <span>3500</span>
                  <span>0</span>
                </div>

                {/* Chart area */}
                <div className="ml-12 h-full border-l border-b border-gray-300 relative">
                  {/* Grid lines */}
                  <div className="absolute inset-0 flex flex-col justify-between">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div key={i} className="border-t border-gray-200"></div>
                    ))}
                  </div>

                  {/* X-axis dates */}
                  <div className="absolute -bottom-8 left-0 right-0 flex justify-between text-xs text-gray-500 overflow-x-auto">
                    {chartDates.map((date, index) => (
                      <div
                        key={index}
                        className="text-center transform -rotate-45 origin-top-left whitespace-nowrap"
                      >
                        {date}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* All Expenses List */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                All Expenses
              </h3>
              <div className="space-y-4">
                {expenses.slice(0, 6).map((expense) => (
                  <div
                    key={expense._id}
                    className="flex justify-between items-center p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 rounded-lg group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-lg">{expense.icon || "💸"}</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {expense.category}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(expense.date)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="font-bold text-red-600">
                        {formatCurrency(expense.amount)}
                      </div>
                      <button
                        onClick={() => handleDelete(expense._id)}
                        className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        title="Delete expense"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}

                {expenses.length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-6xl mb-4">💸</div>
                    <p className="text-gray-500">No expense records found</p>
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Add Your First Expense
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Expense Categories */}
          <div className="space-y-6">
            {/* Expense Categories */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Expense Categories
              </h3>
              <div className="space-y-4">
                {Array.from(new Set(expenses.map((e) => e.category)))
                  .slice(0, 8)
                  .map((category) => {
                    const categoryExpenses = expenses.filter(
                      (e) => e.category === category
                    );
                    const totalAmount = categoryExpenses.reduce(
                      (sum, exp) => sum + exp.amount,
                      0
                    );
                    const latestExpense = categoryExpenses[0];

                    return (
                      <div
                        key={category}
                        className="border-b border-gray-200 pb-4 last:border-b-0"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900 text-lg">
                              {category}
                            </h4>
                            {latestExpense && (
                              <p className="text-gray-500 text-sm">
                                {formatDate(latestExpense.date)}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-red-600 text-lg">
                              {formatCurrency(totalAmount)}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2 mt-2">
                          {categoryExpenses.slice(0, 2).map((expense) => (
                            <div
                              key={expense._id}
                              className="flex justify-between items-center text-sm group relative"
                            >
                              <span className="text-gray-600">
                                {formatDate(expense.date)}
                              </span>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-red-600">
                                  {formatCurrency(expense.amount)}
                                </span>
                                <button
                                  onClick={() => handleDelete(expense._id)}
                                  className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs"
                                  title="Delete expense"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          ))}
                          {categoryExpenses.length > 2 && (
                            <div className="text-center">
                              <button className="text-blue-600 text-sm font-medium">
                                +{categoryExpenses.length - 2} more
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                {expenses.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No categories found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Expenses Summary */}
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Expense Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Total Expenses</span>
                  <span className="font-semibold">
                    {formatCurrency(
                      expenses.reduce((sum, exp) => sum + exp.amount, 0)
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>This Month</span>
                  <span className="font-semibold">
                    {formatCurrency(
                      expenses
                        .filter((exp) => {
                          const expDate = new Date(exp.date);
                          const now = new Date();
                          return (
                            expDate.getMonth() === now.getMonth() &&
                            expDate.getFullYear() === now.getFullYear()
                          );
                        })
                        .reduce((sum, exp) => sum + exp.amount, 0)
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Categories</span>
                  <span className="font-semibold">
                    {new Set(expenses.map((e) => e.category)).size}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Add Expense Form Component
const AddExpenseForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    icon: "💸",
  });
  const [loading, setLoading] = useState(false);

  const expenseIcons = [
    "💸",
    "🛍️",
    "✈️",
    "⚡",
    "🏠",
    "🍔",
    "🚗",
    "🎬",
    "🏥",
    "🎓",
  ];

  const expenseCategories = [
    "Shopping",
    "Travel",
    "Food",
    "Entertainment",
    "Bills",
    "Healthcare",
    "Education",
    "Transport",
    "Personal",
    "Other",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        ...formData,
        amount: Number(formData.amount),
      });
      onSuccess();
    } catch (error) {
      console.error("Error adding expense:", error);
      alert("Error adding expense. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-900">Add Expense</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Icon Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Pick Icon
          </label>
          <div className="grid grid-cols-5 gap-3">
            {expenseIcons.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => handleChange("icon", icon)}
                className={`p-3 rounded-lg border-2 text-xl transition-all ${
                  formData.icon === icon
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Expense Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expense Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            required
          >
            <option value="">Select a category</option>
            {expenseCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount
          </label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => handleChange("amount", e.target.value)}
            placeholder="0"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            required
            min="0"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleChange("date", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            required
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Expense"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Expense;

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axiosInstance from "../../utils/axiosInstance";
// import { API_PATHS } from "../../utils/apiPaths";

// const Expense = () => {
//   const [expenses, setExpenses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchExpenses();
//   }, []);

//   const fetchExpenses = async () => {
//     try {
//       const response = await axiosInstance.get(
//         API_PATHS.EXPENSE.GET_ALL_EXPENSE
//       );
//       setExpenses(response.data.expenses || []);
//     } catch (error) {
//       console.error("Error fetching expenses:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownloadExcel = async () => {
//     try {
//       const response = await axiosInstance.get(
//         API_PATHS.EXPENSE.DOWNLOAD_EXPENSE,
//         {
//           responseType: "blob",
//         }
//       );
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", "expense_details.xlsx");
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (error) {
//       console.error("Error downloading Excel:", error);
//     }
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "USD",
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(amount);
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const day = date.getDate();
//     const suffix =
//       day === 1 ? "st" : day === 2 ? "nd" : day === 3 ? "rd" : "th";
//     const month = date.toLocaleDateString("en-US", { month: "short" });
//     const year = date.getFullYear();
//     return `${day}${suffix} ${month} ${year}`;
//   };

//   // Sample data for chart dates (like in your image)
//   const chartDates = [
//     "2nd Jan",
//     "3rd Jan",
//     "4th Jan",
//     "5th Jan",
//     "6th Jan",
//     "7th Jan",
//     "8th Jan",
//     "9th Jan",
//     "10th Jan",
//     "11th Jan",
//     "12th Jan",
//     "14th Jan",
//     "15th Feb",
//     "16th Feb",
//     "17th Feb",
//   ];

//   if (loading) {
//     return (
//       <div className="p-6">
//         <div className="flex items-center justify-center h-64">
//           <div className="text-lg text-gray-600">Loading...</div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">
//           Expense Tracker
//         </h1>
//         <h2 className="text-2xl font-semibold text-gray-700">
//           Expense Overview
//         </h2>
//         <p className="text-gray-600 mt-2">
//           Track your spending trends over time and gain insights into where your
//           money goes.
//         </p>
//       </div>

//       {/* Action Buttons */}
//       <div className="flex gap-4 mb-8">
//         <button
//           onClick={() => setShowAddForm(true)}
//           className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
//         >
//           + Add Expense
//         </button>
//         <button
//           onClick={handleDownloadExcel}
//           className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
//         >
//           📥 Download Excel
//         </button>
//       </div>

//       {showAddForm ? (
//         <AddExpenseForm
//           onClose={() => setShowAddForm(false)}
//           onSuccess={() => {
//             setShowAddForm(false);
//             fetchExpenses();
//           }}
//         />
//       ) : (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Left Column - Chart and Expenses */}
//           <div className="space-y-6">
//             {/* Chart Section */}
//             <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
//               <div className="flex justify-between items-start mb-6">
//                 <div>
//                   <h3 className="text-xl font-semibold text-gray-900">
//                     Expense Trend
//                   </h3>
//                   <p className="text-gray-600 text-sm mt-1">
//                     Track your spending patterns
//                   </p>
//                 </div>
//               </div>

//               {/* Chart Placeholder with dates like image */}
//               <div className="h-64 relative">
//                 {/* Y-axis labels */}
//                 <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-500">
//                   <span>14000</span>
//                   <span>10500</span>
//                   <span>7000</span>
//                   <span>3500</span>
//                   <span>0</span>
//                 </div>

//                 {/* Chart area */}
//                 <div className="ml-12 h-full border-l border-b border-gray-300 relative">
//                   {/* Grid lines */}
//                   <div className="absolute inset-0 flex flex-col justify-between">
//                     {[0, 1, 2, 3, 4].map((i) => (
//                       <div key={i} className="border-t border-gray-200"></div>
//                     ))}
//                   </div>

//                   {/* X-axis dates */}
//                   <div className="absolute -bottom-8 left-0 right-0 flex justify-between text-xs text-gray-500 overflow-x-auto">
//                     {chartDates.map((date, index) => (
//                       <div
//                         key={index}
//                         className="text-center transform -rotate-45 origin-top-left whitespace-nowrap"
//                       >
//                         {date}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* All Expenses List */}
//             <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
//               <h3 className="text-xl font-semibold text-gray-900 mb-6">
//                 All Expenses
//               </h3>
//               <div className="space-y-4">
//                 {expenses.slice(0, 6).map((expense) => (
//                   <div
//                     key={expense._id}
//                     className="flex justify-between items-center p-4 border-b border-gray-100 last:border-b-0"
//                   >
//                     <div className="flex items-center space-x-4">
//                       <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
//                         <span className="text-lg">{expense.icon || "💸"}</span>
//                       </div>
//                       <div>
//                         <div className="font-medium text-gray-900">
//                           {expense.category}
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           {formatDate(expense.date)}
//                         </div>
//                       </div>
//                     </div>
//                     <div className="font-bold text-red-600">
//                       {formatCurrency(expense.amount)}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Right Column - Expense Categories */}
//           <div className="space-y-6">
//             {/* Expense Categories */}
//             <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
//               <h3 className="text-xl font-semibold text-gray-900 mb-6">
//                 Expense Categories
//               </h3>
//               <div className="space-y-4">
//                 {Array.from(new Set(expenses.map((e) => e.category)))
//                   .slice(0, 8)
//                   .map((category, index) => {
//                     const categoryExpenses = expenses.filter(
//                       (e) => e.category === category
//                     );
//                     const totalAmount = categoryExpenses.reduce(
//                       (sum, exp) => sum + exp.amount,
//                       0
//                     );
//                     const latestExpense = categoryExpenses[0];

//                     return (
//                       <div
//                         key={category}
//                         className="border-b border-gray-200 pb-4 last:border-b-0"
//                       >
//                         <div className="flex justify-between items-start mb-2">
//                           <div>
//                             <h4 className="font-semibold text-gray-900 text-lg">
//                               {category}
//                             </h4>
//                             {latestExpense && (
//                               <p className="text-gray-500 text-sm">
//                                 {formatDate(latestExpense.date)}
//                               </p>
//                             )}
//                           </div>
//                           <div className="text-right">
//                             <div className="font-bold text-red-600 text-lg">
//                               {formatCurrency(totalAmount)}
//                             </div>
//                           </div>
//                         </div>
//                         <div className="space-y-2 mt-2">
//                           {categoryExpenses
//                             .slice(0, 2)
//                             .map((expense, index) => (
//                               <div
//                                 key={expense._id}
//                                 className="flex justify-between items-center text-sm"
//                               >
//                                 <span className="text-gray-600">
//                                   {formatDate(expense.date)}
//                                 </span>
//                                 <span className="font-medium text-red-600">
//                                   {formatCurrency(expense.amount)}
//                                 </span>
//                               </div>
//                             ))}
//                           {categoryExpenses.length > 2 && (
//                             <div className="text-center">
//                               <button className="text-blue-600 text-sm font-medium">
//                                 +{categoryExpenses.length - 2} more
//                               </button>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     );
//                   })}
//               </div>
//             </div>

//             {/* Recent Expenses Summary */}
//             <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white">
//               <h3 className="text-lg font-semibold mb-4">Expense Summary</h3>
//               <div className="space-y-3">
//                 <div className="flex justify-between items-center">
//                   <span>Total Expenses</span>
//                   <span className="font-semibold">
//                     {formatCurrency(
//                       expenses.reduce((sum, exp) => sum + exp.amount, 0)
//                     )}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span>This Month</span>
//                   <span className="font-semibold">
//                     {formatCurrency(
//                       expenses
//                         .filter((exp) => {
//                           const expDate = new Date(exp.date);
//                           const now = new Date();
//                           return (
//                             expDate.getMonth() === now.getMonth() &&
//                             expDate.getFullYear() === now.getFullYear()
//                           );
//                         })
//                         .reduce((sum, exp) => sum + exp.amount, 0)
//                     )}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span>Categories</span>
//                   <span className="font-semibold">
//                     {new Set(expenses.map((e) => e.category)).size}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Add Expense Form Component
// const AddExpenseForm = ({ onClose, onSuccess }) => {
//   const [formData, setFormData] = useState({
//     category: "",
//     amount: "",
//     date: new Date().toISOString().split("T")[0],
//     icon: "💸",
//   });
//   const [loading, setLoading] = useState(false);

//   const expenseIcons = [
//     "💸",
//     "🛍️",
//     "✈️",
//     "⚡",
//     "🏠",
//     "🍔",
//     "🚗",
//     "🎬",
//     "🏥",
//     "🎓",
//   ];

//   const expenseCategories = [
//     "Shopping",
//     "Travel",
//     "Food",
//     "Entertainment",
//     "Bills",
//     "Healthcare",
//     "Education",
//     "Transport",
//     "Personal",
//     "Other",
//   ];

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
//         ...formData,
//         amount: Number(formData.amount),
//       });
//       onSuccess();
//     } catch (error) {
//       console.error("Error adding expense:", error);
//       alert("Error adding expense. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   return (
//     <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 max-w-2xl mx-auto">
//       <div className="flex justify-between items-center mb-6">
//         <h3 className="text-2xl font-semibold text-gray-900">Add Expense</h3>
//         <button
//           onClick={onClose}
//           className="text-gray-500 hover:text-gray-700 text-xl"
//         >
//           ✕
//         </button>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Icon Selection */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-3">
//             Pick Icon
//           </label>
//           <div className="grid grid-cols-5 gap-3">
//             {expenseIcons.map((icon) => (
//               <button
//                 key={icon}
//                 type="button"
//                 onClick={() => handleChange("icon", icon)}
//                 className={`p-3 rounded-lg border-2 text-xl transition-all ${
//                   formData.icon === icon
//                     ? "border-red-500 bg-red-50"
//                     : "border-gray-200 hover:border-gray-300"
//                 }`}
//               >
//                 {icon}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Expense Category */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Expense Category
//           </label>
//           <select
//             value={formData.category}
//             onChange={(e) => handleChange("category", e.target.value)}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
//             required
//           >
//             <option value="">Select a category</option>
//             {expenseCategories.map((category) => (
//               <option key={category} value={category}>
//                 {category}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Amount */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Amount
//           </label>
//           <input
//             type="number"
//             value={formData.amount}
//             onChange={(e) => handleChange("amount", e.target.value)}
//             placeholder="0"
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
//             required
//             min="0"
//           />
//         </div>

//         {/* Date */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Date
//           </label>
//           <input
//             type="date"
//             value={formData.date}
//             onChange={(e) => handleChange("date", e.target.value)}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
//             required
//           />
//         </div>

//         {/* Action Buttons */}
//         <div className="flex gap-4 pt-4">
//           <button
//             type="button"
//             onClick={onClose}
//             className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={loading}
//             className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
//           >
//             {loading ? "Adding..." : "Add Expense"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Expense;
