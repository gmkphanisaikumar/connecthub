import Navbar from './Navbar';
import Sidebar from './Sidebar';

// This wraps all authenticated pages with Navbar + Sidebar
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          <Sidebar />
          {/* Main content area */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
