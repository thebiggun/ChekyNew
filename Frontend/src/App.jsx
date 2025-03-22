import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./Components/navBar";
import Billing from "./Components/Billing";
import Inventory from "./Components/Inventory";
import FlashSale from "./Components/FlashSale";
import Restocking from "./Components/Restocking";

const App = () => {
  return (
    <Router>
      <div className="flex bg-[#E8E8E8]">
        <div className="w-50 sticky top-0 h-screen">
          <NavBar />
        </div>
        <div className="w-full p-4 ">
          <Routes>
            <Route path="/" element={<Navigate to="/billing" />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/flash-sale" element={<FlashSale />} />
            <Route path="*" element={<Navigate to="/billing" />} />
            <Route path="/restocking" element={<Restocking />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
