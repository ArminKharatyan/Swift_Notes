import React, { useState } from "react";
import PasswordInput from "../../components/Input/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail, validatePassword } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import ThemeContextProvider from "../../context/ThemeContext";
import swiftNotesImage from "../../assets/images/swift-notes.png";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  
  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("Please enter your name");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      setError(passwordErrors[0]);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    try {
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
        email: email,
        password: password,
      });

      if (response.data && response.data.error) {
        setError(response.data.message);
        return;
      }

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <ThemeContextProvider>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-blue-400 dark:bg-gray-900">
        <div className="flex w-full max-w-4xl shadow-lg bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
          <div className="hidden lg:block lg:w-1/2 bg-cover">
            <img src={swiftNotesImage} alt="SwiftNotes App" className="w-full h-full object-cover" />
          </div>
          <div className="w-full lg:w-1/2 p-10">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-700 dark:text-white">
                Welcome to Swift Notes
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Easily create, organize, and manage your notes
              </p>
            </div>
            <form onSubmit={handleSignUp}>
              <h4 className="text-2xl mb-7 dark:text-white">Sign Up</h4>

              <input
                type="text"
                placeholder="Name"
                className="input-box dark:text-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                type="text"
                placeholder="Email"
                className="input-box dark:text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <PasswordInput
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
              />

              <PasswordInput
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <div style={{ minHeight: "40px" }}>
                {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
              </div>

              <button type="submit" className="btn-primary">
                Create Account
              </button>

              <p className="text-sm text-center mt-4 dark:text-white">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-primary underline">
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </ThemeContextProvider>
  );
};

export default SignUp;
