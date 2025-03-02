import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Invoice from "./pages/Invoice";
import Paketan from "./pages/Paketan";
import Settings from "./pages/settings";
import Sidebar from "./components/Sidebar";

function App() {

  return (
    <Router>
      <div className="drawer lg:drawer-open">
        <Sidebar />
        <div className="drawer-content flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/invoice" element={<Invoice/>} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/paketan" element={<Paketan />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
