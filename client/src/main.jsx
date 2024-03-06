import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginSignupPage from "./pages/LoginSignup.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard/:username/" element={<App />} />
        <Route path="*" element={<LoginSignupPage />} />
        <Route path="/" element={<LoginSignupPage />} />
      </Routes>
    </BrowserRouter>
  </>
);
