import React from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { formatTokensOrCost } from '../utils/numberFormatting';
import { CogIcon, CurrencyDollarIcon, PencilSquareIcon } from '@heroicons/react/24/outline';


function Header({ sidebarOpen, setSidebarOpen, usage }) {
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <header className="bg-white border-0 border-black shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <button
              onClick={toggleSidebar}
              className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
          >
            {sidebarOpen ? (
                <XMarkIcon className="h-6 w-6" aria-hidden="true"/>
            ) : (
                <Bars3Icon className="h-6 w-6" aria-hidden="true"/>
            )}
          </button>
          <span className="text-2xl mr-2" role="img" aria-label="Robot">🤖</span>
          <span className="logo">Claude Unlimited</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm font-bold">
            <CogIcon className="h-5 w-5 mr-1" aria-hidden="true"/>
            API: sk-***
          </div>
          <div className="flex items-center text-sm font-bold">
            <CurrencyDollarIcon className="h-5 w-5 mr-1" aria-hidden="true"/>
            Cost: {usage && usage.cost !== undefined ? formatTokensOrCost(usage.cost, true) + ' ' : '$0 '}
          </div>
          <div className="flex items-center text-sm font-bold">
            <PencilSquareIcon className="h-5 w-5 mr-1" aria-hidden="true"/>
            Tokens: {usage && usage.tokens !== undefined ? formatTokensOrCost(usage.tokens) + ' ' : '0 '}
          </div>
          <div className="relative">
            <img
                className="h-8 w-8 rounded-full object-cover object-center"
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