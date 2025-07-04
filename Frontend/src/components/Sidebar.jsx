import { Link } from "react-router-dom";
import { Package2, ReceiptText, Home, Settings } from "lucide-react";

const Sidebar = () => {
  return (
    <>
      {/* Mobile toggle button */}
      <div className="lg:hidden fixed top-2 left-2 z-50">
        <label htmlFor="my-drawer" className="btn btn-ghost drawer-button">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </label>
      </div>

      {/* Sidebar */}
      <div className="drawer lg:drawer-open">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        
        <div className="drawer-side z-40">
          <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
          
          <div className="menu p-4 w-64 min-h-full bg-base-100 text-base-content border-r">
            {/* Sidebar content */}
            <div className="brand mb-4 p-2">
              <h1 className="text-xl font-bold">Invoice App</h1>
            </div>

            <li>
              <Link to="/" className="flex items-center py-2 px-4 rounded-lg hover:bg-gray-100">
                <Home className="w-5 h-5 mr-3" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link to="/invoice" className="flex items-center py-2 px-4 rounded-lg hover:bg-gray-100">
                <ReceiptText className="w-5 h-5 mr-3" />
                <span>Invoice</span>
              </Link>
            </li>
            <li>
              <Link to="/paketan" className="flex items-center py-2 px-4 rounded-lg hover:bg-gray-100">
                <Package2 className="w-5 h-5 mr-3" />
                <span>Pricelist</span>
              </Link>
            </li>
            <li>
              <Link to="/settings" className="flex items-center py-2 px-4 rounded-lg hover:bg-gray-100">
                <Settings className="w-5 h-5 mr-3" />
                <span>Settings</span>
              </Link>
            </li>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;