import React, { useContext } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

const Layout = () => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) {
    navigate("/login");
  }

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    clearUser();
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-64 bg-gradient-to-br from-purple-600 to-purple-800 text-white flex flex-col">
        <div className="p-6 border-b border-purple-500 mb-4">
          <h1 className="text-2xl font-bold mb-4">Expense Tracker</h1>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {user?.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                user?.fullName?.charAt(0) || "M"
              )}
            </div>
            <div>
              <h3 className="font-semibold text-white">
                {user?.fullName || "Mike William"}
              </h3>
              <p className="text-purple-200 text-sm">Welcome back!</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <button
            onClick={() => handleNavigation("/dashboard")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive("/dashboard")
                ? "bg-white text-purple-600 shadow-lg"
                : "text-purple-100 hover:bg-purple-500 hover:text-white"
            }`}
          >
            <span className="text-xl">📊</span>
            <span className="font-medium">Dashboard</span>
          </button>

          <button
            onClick={() => handleNavigation("/income")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive("/income")
                ? "bg-white text-purple-600 shadow-lg"
                : "text-purple-100 hover:bg-purple-500 hover:text-white"
            }`}
          >
            <span className="text-xl">💰</span>
            <span className="font-medium">Income</span>
          </button>

          <button
            onClick={() => handleNavigation("/expense")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive("/expense")
                ? "bg-white text-purple-600 shadow-lg"
                : "text-purple-100 hover:bg-purple-500 hover:text-white"
            }`}
          >
            <span className="text-xl">💸</span>
            <span className="font-medium">Expense</span>
          </button>

          <div className="border-t border-purple-500 my-4"></div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-purple-100 hover:bg-red-500 hover:text-white transition-all duration-200"
          >
            <span className="text-xl">🚪</span>
            <span className="font-medium">Logout</span>
          </button>
        </nav>
      </div>

      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
