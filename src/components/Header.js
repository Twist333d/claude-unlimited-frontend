import React from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

function Header({ sidebarOpen, setSidebarOpen }) {
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
          >
            {sidebarOpen ? (
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
          <img className="h-8 w-auto" src="/logo.svg" alt="Claude Unlimited" />
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">API Token: ********</span>
          <span className="text-sm text-gray-500">Usage: $ USD | X tokens</span>
          <div className="relative">
            <img
              className="h-8 w-8 rounded-full"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt=""
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;