import { Link, useLocation } from "react-router-dom";
import { Package2, ReceiptText, Home, Settings, Inbox } from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block drawer-side z-40">
        <label 
          htmlFor="my-drawer" 
          aria-label="close sidebar" 
          className="drawer-overlay"
        ></label>
        <div className="menu p-4 w-64 border-r min-h-full bg-base-100 text-base-content">
          <div className="mb-4 p-2">
            <h1 className="text-xl font-bold">Invoice App</h1>
          </div>
          <li>
            <Link 
              to="/" 
              className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 ${
                isActive('/') ? 'bg-blue-50 text-blue-600' : ''
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/invoice" 
              className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 ${
                isActive('/invoice') ? 'bg-blue-50 text-blue-600' : ''
              }`}
            >
              <ReceiptText className="w-5 h-5" />
              <span>Invoice</span>
            </Link>
          </li>
          {/* <li>
            <Link 
              to="/paketan" 
              className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 ${
                isActive('/paketan') ? 'bg-blue-50 text-blue-600' : ''
              }`}
            >
              <Package2 className="w-5 h-5" />
              <span>Pricelist</span>
            </Link>
          </li> */}
          <li>
            <Link 
              to="/settings" 
              className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 ${
                isActive('/settings') ? 'bg-blue-50 text-blue-600' : ''
              }`}
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </Link>
          </li>
        </div>
      </div>

      {/* Mobile Bottom Dock */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <Link 
            to="/" 
            className={`flex flex-col items-center gap-1 p-2 rounded-lg min-w-[60px] ${
              isActive('/') ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Home</span>
          </Link>
          
          <Link 
            to="/invoice" 
            className={`flex flex-col items-center gap-1 p-2 rounded-lg min-w-[60px] ${
              isActive('/invoice') ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <ReceiptText size={24} />
            <span className="text-xs font-medium">Invoice</span>
          </Link>
          
          <Link 
            to="/settings" 
            className={`flex flex-col items-center gap-1 p-2 rounded-lg min-w-[60px] ${
              isActive('/settings') ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <Settings className="w-6 h-6" />
            <span className="text-xs font-medium">Settings</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Sidebar;