import Sidebar from './Sidebar';

export const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        {children}
      </div>
    </div>
  );
};