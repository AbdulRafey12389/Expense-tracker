import React, { useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useNavigate } from "react-router-dom";

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();

  const { user } = useContext(UserContext);

  if (!user) {
    navigate("/login");
  }

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME);
      setIncomes(response.data.incomes || []);
    } catch (error) {
      console.error("Error fetching incomes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (incomeId) => {
    if (window.confirm("Are you sure you want to delete this income?")) {
      try {
        await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(incomeId));
        fetchIncomes(); // Refresh the list
      } catch (error) {
        console.error("Error deleting income:", error);
        alert("Error deleting income. Please try again.");
      }
    }
  };

  const handleDownloadExcel = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.INCOME.DOWNLOAD_INCOME,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "income_details.xlsx");
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


  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);

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
    <>
      {showAddForm && (
        <div className="fixed w-full h-screen opacity-60 bg-black" />
      )}

      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header Section - Exact like image */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Income Overview
          </h1>
          <p className="text-gray-600">
            Track your earnings over time and analyze your income trends.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Income Sources */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Income Sources
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    + Add Income
                  </button>
                  <button
                    onClick={handleDownloadExcel}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    📥 Download
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {incomes.map((income) => (
                  <div
                    key={income._id}
                    className="flex justify-between items-center p-4 border-b border-gray-100 hover:bg-gray-50 rounded-lg group"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-xl">{income.icon || "💰"}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {income.source}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {formatDate(income.date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-bold text-green-600 text-lg">
                          {formatCurrency(income.amount)}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(income._id)}
                        className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        title="Delete income"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}

                {incomes.length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-6xl mb-4">💰</div>
                    <p className="text-gray-500">No income records found</p>
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Add Your First Income
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Quick Add & Summary */}
          <div className="space-y-6">
            {/* Quick Add Income Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Add Income
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      placeholder="0"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      onClick={() => setShowAddForm(true)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="text"
                    placeholder="12th Feb"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    onClick={() => setShowAddForm(true)}
                  />
                </div>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Add Income
                </button>
              </div>
            </div>

            {/* Total Income Summary */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Total Income</h3>
              <div className="text-3xl font-bold mb-4">
                {formatCurrency(totalIncome)}
              </div>
              <div className="text-green-100 text-sm">
                {incomes.length} income source{incomes.length !== 1 ? "s" : ""}
              </div>
            </div>

            {/* Recent Income Timeline */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Income
              </h3>
              <div className="space-y-3">
                {incomes.slice(0, 4).map((income) => (
                  <div
                    key={income._id}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-gray-600">{income.source}</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(income.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Add Income Form Modal */}
        {showAddForm && (
          <AddIncomeForm
            onClose={() => setShowAddForm(false)}
            onSuccess={() => {
              setShowAddForm(false);
              fetchIncomes();
            }}
          />
        )}
      </div>
    </>
  );
};


const AddIncomeForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    source: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    icon: "💰",
  });
  const [loading, setLoading] = useState(false);

  const incomeIcons = [
    "💰",
    "💼",
    "🏦",
    "🎨",
    "🛒",
    "📊",
    "💻",
    "📱",
    "🏠",
    "🚀",
  ];
  const commonSources = [
    "Salary",
    "Freelance",
    "Business",
    "Investment",
    "Rental",
    "Bonus",
    "Commission",
    "Other",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
        ...formData,
        amount: Number(formData.amount),
      });
      onSuccess();
    } catch (error) {
      console.error("Error adding income:", error);
      alert("Error adding income. Please try again.");
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
    <div className="fixed inset-0 bg-blend-darken flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-900">Add Income</h3>
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
              {incomeIcons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => handleChange("icon", icon)}
                  className={`p-3 rounded-lg border-2 text-xl transition-all ${
                    formData.icon === icon
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Income Source */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Income Source
            </label>
            <select
              value={formData.source}
              onChange={(e) => handleChange("source", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="">Select income source</option>
              {commonSources.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={formData.source}
              onChange={(e) => handleChange("source", e.target.value)}
              placeholder="Or enter custom source"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent mt-2"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                placeholder="0"
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
                min="0"
              />
            </div>
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
              className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Income"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Income;
