import { Link } from "react-router-dom";
import {Package2, ReceiptText, Home, Settings} from "lucide-react"

const Sidebar = () => {
  return (

    <div className="drawer lg:drawer-open ">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-side">

            <ul className="menu border-r text-base-content min-h-full p-4">
            {/* Sidebar content here */}
            <div className="brand font-bold">
                <h1 className="text-lg">Invoice App</h1>
            </div>

            <li>
                <Link to="/"><Home className="w-5 h-5" /> Home</Link>
            </li>
            <li>
                <Link to="/invoice"><ReceiptText className="w-5 h-5" /> Invoice</Link>
            </li>
            <li>
                <Link to="/paketan"><Package2 className="w-5 h-5" /> Pricelist</Link>
            </li>
            <li>
                <Link to="/settings"><Settings className="w-5 h-5" /> Settings</Link>
            </li>
            </ul>
        </div>
    </div>

  );
};

export default Sidebar;
