import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Konten utama */}
        {children}
      </div>
      <Sidebar />
    </div>
  );
};

export default Layout;