import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Bot, Package, Scan, Clock } from 'lucide-react';

interface HomePageProps {
  darkMode: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ darkMode }) => {
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-800 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581094794329-c8112c4e1b0d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"></div>
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold ${darkMode ? 'text-white' : 'text-white'} mb-6`}>
            Welcome to Our Robotic Warehouse
          </h1>
          <p className={`text-xl sm:text-2xl ${darkMode ? 'text-gray-200' : 'text-gray-100'} mb-8 max-w-3xl mx-auto`}>
            Experience the future of warehouse management with our state-of-the-art robotic automation system.
          </p>
          <button
            onClick={() => navigate('/inventory')}
            className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm ${
              darkMode
                ? 'bg-white text-primary-600 hover:bg-gray-100'
                : 'bg-white text-primary-600 hover:bg-gray-100'
            } transition-colors duration-200 ease-in-out hover:shadow-lg`}
          >
            Explore Our Inventory
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl font-bold text-center mb-12 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            How Our Robotic Warehouse Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <Bot className={`h-12 w-12 ${darkMode ? 'text-primary-400' : 'text-primary-600'} mb-4`} />
              <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Robotic Automation
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Our advanced robots handle all warehouse operations with precision and efficiency.
              </p>
            </div>
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <Scan className={`h-12 w-12 ${darkMode ? 'text-primary-400' : 'text-primary-600'} mb-4`} />
              <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Smart Scanning
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                AI-powered scanning system ensures accurate product identification and tracking.
              </p>
            </div>
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <Clock className={`h-12 w-12 ${darkMode ? 'text-primary-400' : 'text-primary-600'} mb-4`} />
              <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Real-time Updates
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Get instant updates on inventory status and product movements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-primary-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl font-bold text-center mb-12 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'AI-Powered Scanning',
                description: 'Advanced computer vision for accurate product identification',
                icon: Scan,
              },
              {
                title: 'Automated Storage',
                description: 'Efficient storage and retrieval system',
                icon: Package,
              },
              {
                title: 'Real-time Tracking',
                description: 'Live updates on inventory and product movements',
                icon: Clock,
              },
              {
                title: 'Smart Robots',
                description: 'Autonomous robots for warehouse operations',
                icon: Bot,
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-lg hover:shadow-xl transition-shadow duration-300`}
              >
                <feature.icon className={`h-12 w-12 ${darkMode ? 'text-primary-400' : 'text-primary-600'} mb-4`} />
                <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {feature.title}
                </h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 