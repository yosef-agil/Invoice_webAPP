import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden lg:flex">
        <div className="drawer lg:drawer-open">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex flex-col">
            {children}
          </div>
          <Sidebar />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="pb-20">
          {children}
        </div>
        <Sidebar />
      </div>
    </>
  );
};

export default Layout;