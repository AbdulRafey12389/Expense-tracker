import React, { useContext, useState } from "react";

import AuthLayout from "../../components/authLayout/AuthLayout";
import { useNavigate } from "react-router-dom";
import Input from "../../components/inputs/input";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/UserContext";
import { TbCircleDotted } from "react-icons/tb";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { updateUser } = useContext(UserContext);

  // Handle Login Form Submit
  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      setLoading(false);
      return;
    }

    setError("");

    // Login API Call
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        updateUser(user);
        setLoading(false);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setLoading(false);
        setError(error.response.data.message);
      } else {
        setLoading(false);
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Please enter your details to log in
        </p>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email Address"
            placeholder="john@example.com"
            type="email"
          />

          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            placeholder="Enter your password"
            type="password"
          />

          <button
            type="submit"
            className="w-full bg-blue-600  text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 mt-4 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? <TbCircleDotted className="animate-spin" /> : "Sign In"}
          </button>

          <p className="text-sm text-center text-slate-600 mt-4">
            Don't have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
