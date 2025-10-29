import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/auth/Login.jsx";
import SignUp from "./pages/auth/SignUp.jsx";
import Home from "./pages/dashboard/Home.jsx";
import Income from "./pages/dashboard/Income.jsx";
import Expense from "./pages/dashboard/Expense.jsx";
import UserProvider from "./context/UserContext.jsx";
import DashboardLayout from "./pages/dashboard/DashBoardLayout.jsx";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <UserProvider>
      <div>
        <Toaster position="top-right" reverseOrder={false} />
        <Router>
          <Routes>
            <Route path="/" element={<Root />} />
            <Route path="/login" exac element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/" element={<DashboardLayout />}>
              <Route index path="dashboard" element={<Home />} />
              <Route index path="income" element={<Income />} />
              <Route index path="expense" element={<Expense />} />
            </Route>
          </Routes>
        </Router>
      </div>
    </UserProvider>
  );
};

export default App;

const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token"); // Replace with actual authentication logic

  console.log(isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  } else {
    return <Navigate to="/dashboard" />;
  }
};
