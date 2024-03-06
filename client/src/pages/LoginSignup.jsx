import React, { useState } from "react";
import { io } from "socket.io-client";
import { Link } from "react-router-dom";

const LoginSignupPage = () => {
  // Receive setSocket function as props
  const [username, setUsername] = useState("");
  const [socket, setSocket] = useState(null);

  const handleInputChange = (e) => {
    setUsername(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const socket = io("http://localhost:3000"); // Create socket instance
    console.log("Socket instance created:", socket);
    socket ? setSocket(socket) : null; // Set the socket instance using setSocket function
    console.log("Logging in with username:", username);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-blue-500 to-green-400">
      <div className="bg-white bg-opacity-25 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center mb-4 text-white">
          Login
        </h2>
        <Link to={`/dashboard/${username}`}>
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
        </Link>
      </div>
    </div>
  );
};

export default LoginSignupPage;
