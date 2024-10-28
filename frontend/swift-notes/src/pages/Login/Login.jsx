import React, { useState } from "react";
import PasswordInput from "../../components/Input/PasswordInput";
import axiosInstance from "../../utils/axiosInstance";
import { validateEmail } from "../../utils/helper";
import { Link, useNavigate } from "react-router-dom";
import ThemeContextProvider from "../../context/ThemeContext";
import swiftNotesImage from "../../assets/images/swift-notes.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }

    setError('')

    try {
      const response = await axiosInstance.post("/login", {
        email: email,
        password: password,
      });

      if(response.data && response.data.accessToken){
        localStorage.setItem("token", response.data.accessToken)
        navigate('/dashboard')
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
    <>
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

              <form onSubmit={handleLogin}>
                <h4 className="text-3xl mb-7 dark:text-white">Login</h4>

                <input
                  type="text"
                  placeholder="Email"
                  className="input-box w-full mb-4 dark:text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <div style={{ minHeight: '40px' }}>
                  {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
                </div>

                <button type="submit" className="btn-primary w-full mt-6">
                  Login
                </button>

                <p className="text-sm text-center mt-4 dark:text-white">
                  Not registered yet?{" "}
                  <Link to="/signUp" className="font-medium text-primary underline">
                    Create an Account
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </ThemeContextProvider>
    </>
  );
};

export default Login;
