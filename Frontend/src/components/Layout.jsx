import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-4 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;