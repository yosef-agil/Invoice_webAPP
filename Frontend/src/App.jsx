import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Invoice from "./pages/Invoice";
import Paketan from "./pages/Paketan";
import Settings from "./pages/Pengaturan";
import Read from "./pages/read";
import Sidebar from "./components/Sidebar";
import PDFPreview from "./pages/PDFInvoice";

function App() {
  return (
    <Router>
      <div className="flex min-h-screen">
        {/* Sidebar akan tetap muncul di semua halaman */}
        <Sidebar />
        
        {/* Konten utama */}
        <div className="flex-1 lg:ml-64 overflow-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/invoice" element={<Invoice />} />
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