import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Home, Package, Scan } from 'lucide-react';
import HomePage from './pages/HomePage';
import InventoryPage from './pages/InventoryPage';
import ScannedProductsPage from './pages/ScannedProductsPage';

const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold transition-all duration-200 ease-in-out
        ${isActive 
          ? 'text-blue-700 dark:text-blue-400' 
          : 'text-black hover:text-blue-600 dark:text-gray-900 dark:hover:text-blue-400'
        }
        hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md
      `}
    >
      {children}
      {isActive && (
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 transform transition-all duration-200 ease-in-out"></span>
      )}
    </Link>
  );
};

const App = () => {
  const [darkMode, setDarkMode] = React.useState(false);

  return (
    <Router>
      <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
        <nav className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-900/95 border-gray-800' : 'bg-white/95 border-gray-200'} border-b backdrop-blur-sm shadow-sm`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-8">
                <div className="flex-shrink-0 flex items-center">
                  <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
                    RoboWarehouse
                  </span>
                </div>
                <div className="hidden sm:flex sm:space-x-2">
                  <NavLink to="/">
                    <Home className="h-5 w-5 mr-2" />
                    Home
                  </NavLink>
                  <NavLink to="/inventory">
                    <Package className="h-5 w-5 mr-2" />
                    Inventory
                  </NavLink>
                  <NavLink to="/scanned-products">
                    <Scan className="h-5 w-5 mr-2" />
                    Scanned Products
                  </NavLink>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-2 rounded-lg transition-colors duration-200 ease-in-out
                    ${darkMode 
                      ? 'text-gray-200 hover:text-white hover:bg-gray-800' 
                      : 'text-black hover:text-gray-900 hover:bg-gray-100'
                    }
                  `}
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<HomePage darkMode={darkMode} />} />
            <Route path="/inventory" element={<InventoryPage darkMode={darkMode} />} />
            <Route path="/scanned-products" element={<ScannedProductsPage darkMode={darkMode} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App; 