import React, { useContext } from "react";
import AuthLayout from "../../components/authLayout/AuthLayout";
import { useNavigate } from "react-router-dom";
import Input from "../../components/inputs/input";
import { validateEmail } from "../../utils/helper";

import { useState } from "react";
import ProfilePhotoSelector from "../../components/inputs/ProfilePhotoSelector";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/UserContext";
// import { FaCircle, FaCircleCheck } from "react-icons/fa6";
import { TbCircleDotted } from "react-icons/tb";

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { updateUser } = useContext(UserContext);

  // Handle Sign Up Form Submit
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!fullName) {
      setError("Please enter your name");
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    if (!password) {
      setError("Please enter the password");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    setError("");

    // SignUp API Call with Image Upload
    try {
      let profileImageUrl = "";

      // Upload profile image if exists
      if (profilePic) {
        const imageFormData = new FormData();
        imageFormData.append("image", profilePic);

        const imageUploadResponse = await axiosInstance.post(
          API_PATHS.IMAGE.UPLOAD_IMAGE,
          imageFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (imageUploadResponse.data.imageUrl) {
          profileImageUrl = imageUploadResponse.data.imageUrl;
        }
      }

      // Register user with profile image
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email,
        password,
        profileImageUrl,
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
      <div className="lg:w-full h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Create an Account</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Join us today by entering your details below.
        </p>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <form onSubmit={handleSignUp}>
          {/* Profile Picture Upload */}

          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              label="Full Name"
              placeholder="John Doe"
              type="text"
            />

            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email Address"
              placeholder="john@example.com"
              type="email"
            />
          </div>

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
            {loading ? <TbCircleDotted className="animate-spin" /> : "Sign Up"}
          </button>
        </form>

        <p className="text-xs text-slate-600 mt-4 text-center">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline"
          >
            Log in here
          </button>
        </p>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
