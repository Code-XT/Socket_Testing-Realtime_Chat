import React, { useState } from "react";
import { io } from "socket.io-client";
import { Route, Routes, useNavigate, Navigate, Link } from "react-router-dom";
import App from "../App";

const LoginSignupPage = () => {
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setUsername(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoggedIn(true); // Update state to indicate user is logged in

    navigate(`/dashboard/${username}`);
  };

  return (
    <>
      {loggedIn ? ( // Render App component if user is logged in
        <Link to={`/dashboard/${username}`} replace reloadDocument />
      ) : (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-blue-500 to-green-400">
          <div className="bg-white bg-opacity-25 p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-semibold text-center mb-4 text-white">
              Login
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="text-white">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  placeholder="Enter your username"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginSignupPage;
