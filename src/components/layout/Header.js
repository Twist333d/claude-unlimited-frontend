// Header.js

import React, { useEffect, useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { formatTokensOrCost } from "../../utils/numberFormatting";
import {
  CogIcon,
  CurrencyDollarIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

function Header({ sidebarOpen, setSidebarOpen, usage }) {
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Mobile view */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={toggleSidebar}
              className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
            >
              {sidebarOpen ? (
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Logo - centered on mobile */}
          <div className="flex items-center space-x-2">
            <span className="text-2xl" role="img" aria-label="Robot">
              🤖
            </span>
            <span className="logo text-xl">Claude Unlimited</span>
          </div>

          <div className="flex items-center space-x-4">
            <HeaderInfo
              icon={<CogIcon className="h-5 w-5" />}
              label="API"
              value="sk-***"
            />
            <HeaderInfo
              icon={<CurrencyDollarIcon className="h-5 w-5" />}
              label="Cost"
              value={formatTokensOrCost(usage.total_cost, true)}
            />
            <HeaderInfo
              icon={<PencilSquareIcon className="h-5 w-5" />}
              label="Tokens"
              value={formatTokensOrCost(usage.total_tokens)}
            />
          </div>

          {/* Profile image */}
          <div className="flex items-center p-2">
            <img
              className="h-8 w-8 rounded-full object-cover"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt=""
            />
          </div>
        </div>
      </div>
    </header>
  );
}

function HeaderInfo({ icon, label, value }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 500);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="flex items-center space-x-1">
      {icon}
      <span className="font-bold">
        {label}:{" "}
        <span
          className={`transition-all duration-1000 ${animate ? "animate-fade-down animate-iteration-infinite" : ""}`}
        >
          {value}
        </span>
      </span>
    </div>
  );
}

export default Header;
