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

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/login" exac element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/income" element={<Income />} />
          <Route path="/expense" element={<Expense />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;

const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token"); // Replace with actual authentication logic

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  } else {
    return <Navigate to="/dashboard" />;
  }
};
