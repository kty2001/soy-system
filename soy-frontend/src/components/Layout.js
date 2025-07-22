import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-lg overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout; 