import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Invoice from "./pages/Invoice";
import Paketan from "./pages/Paketan";
import Settings from "./pages/Pengaturan";
import Read from "./pages/read";
import Sidebar from "./components/Sidebar";
import PDFPreview from "./pages/PDFInvoice";
import Layout from "./components/Layout";

function App() {
  useEffect(() => {
    // Force light theme
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.style.colorScheme = 'light';
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/paketan" element={<Paketan />} />
          <Route path="/PDFPreview" element={<PDFPreview />} />
          <Route path="/read/:id" element={<Read />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;