import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Invoice from "./pages/Invoice";
import Paketan from "./pages/Paketan";
import Settings from "./pages/settings";
import Read from "./pages/read";
import Sidebar from "./components/Sidebar";
import PDFPreview from "./pages/PDFInvoice";

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
            <Route path="/PDFPreview" element={<PDFPreview />} />
            <Route path="/read/:id" element={<Read />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
