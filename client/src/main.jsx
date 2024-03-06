import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginSignupPage from "./pages/LoginSignup.jsx";
import { io } from "socket.io-client";
const socket = io("http://localhost:3000");
ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <BrowserRouter>
      <Routes>
        {/* Pass the socket prop to the App component */}
        <Route path="/dashboard/:username" element={<App socket={socket} />} />
        <Route path="/" element={<LoginSignupPage />} />
        <Route path="*" element={<LoginSignupPage />} />
      </Routes>
    </BrowserRouter>
  </>
);
