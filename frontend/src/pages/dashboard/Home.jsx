import React, { useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalBalance: 91100,
    totalIncome: 98200,
    totalExpenses: 7100,
    recentTransactions: [
      {
        type: "expense",
        category: "Shopping",
        amount: 430,
        date: "2025-02-17",
        icon: "🛍️",
      },
      {
        type: "expense",
        category: "Travel",
        amount: 670,
        date: "2025-02-13",
        icon: "✈️",
      },
      {
        type: "income",
        source: "Salary",
        amount: 12000,
        date: "2025-02-12",
        icon: "💰",
      },
      {
        type: "expense",
        category: "Electricity Bill",
        amount: 200,
        date: "2025-02-11",
        icon: "⚡",
      },
    ],
    last30DaysExpenses: {
      total: 7100,
      transactions: [
        { category: "Shopping", amount: 430, icon: "🛍️" },
        { category: "Travel", amount: 670, icon: "✈️" },
        { category: "Electricity Bill", amount: 200, icon: "⚡" },
        { category: "Loan", amount: 500, icon: "🏦" },
      ],
    },
    last60DaysIncome: {
      total: 98200,
      transactions: [
        { source: "Salary", amount: 12000, icon: "💰" },
        { source: "Interest from Savings", amount: 800, icon: "🏦" },
        { source: "Graphic Design", amount: 1500, icon: "🎨" },
        { source: "E-commerce Sales", amount: 3200, icon: "🛒" },
      ],
    },
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Uncomment to fetch real data
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA, {
        timeout: 30000,
      });
      setDashboardData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      {/* <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Expense Tracker
        </h1>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-700">
            {user?.fullName || "Mike William"}
          </h2>
        </div>
      </div> */}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Financial Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Financial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Balance Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Total Balance
              </h3>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(dashboardData.totalBalance)}
              </div>
            </div>

            {/* Total Income Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Total Income
              </h3>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(dashboardData.totalIncome)}
              </div>
            </div>

            {/* Total Expenses Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Total Expenses
              </h3>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(dashboardData.totalExpenses)}
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Transactions
              </h3>
              <button className="text-purple-600 text-sm font-medium">
                See All
              </button>
            </div>

            <div className="space-y-4">
              {dashboardData.recentTransactions.map((transaction, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === "income"
                          ? "bg-green-100"
                          : "bg-red-100"
                      }`}
                    >
                      <span className="text-lg">{transaction.icon}</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {transaction.source || transaction.category}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(transaction.date)}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`text-lg font-semibold ${
                      transaction.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Last 60 Days Income */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Last 60 Days Income
            </h3>
            <div className="space-y-4">
              {dashboardData.last60DaysIncome.transactions.map(
                (income, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{income.icon}</span>
                      <span className="font-medium text-gray-700">
                        {income.source}
                      </span>
                    </div>
                    <div className="font-semibold text-green-600">
                      {formatCurrency(income.amount)}
                    </div>
                  </div>
                )
              )}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="font-semibold text-gray-900">
                  Total Income
                </span>
                <span className="text-xl font-bold text-green-600">
                  {formatCurrency(dashboardData.last60DaysIncome.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Additional Info */}
        <div className="space-y-6">
          {/* Last 30 Days Expenses */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Last 30 Days Expenses
            </h3>
            <div className="space-y-4">
              {dashboardData.last30DaysExpenses.transactions.map(
                (expense, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{expense.icon}</span>
                      <span className="font-medium text-gray-700">
                        {expense.category}
                      </span>
                    </div>
                    <div className="font-semibold text-red-600">
                      {formatCurrency(expense.amount)}
                    </div>
                  </div>
                )
              )}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="font-semibold text-gray-900">
                  Total Expenses
                </span>
                <span className="text-xl font-bold text-red-600">
                  {formatCurrency(dashboardData.last30DaysExpenses.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Financial Overview Summary */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Financial Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Total Balance</span>
                <span className="font-semibold">
                  {formatCurrency(dashboardData.totalBalance)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Total Income</span>
                <span className="font-semibold">
                  {formatCurrency(dashboardData.totalIncome)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Total Expenses</span>
                <span className="font-semibold">
                  {formatCurrency(dashboardData.totalExpenses)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
