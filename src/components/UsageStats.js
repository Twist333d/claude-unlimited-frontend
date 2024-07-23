import React from 'react';
import { formatTokensOrCost } from '../utils/numberFormatting';
import { ChevronRightIcon, CurrencyDollarIcon, BookOpenIcon } from '@heroicons/react/24/outline';

function UsageStats({ usage, isCollapsed }) {
  if (isCollapsed) {
    return (
      <div className="h-full flex items-center justify-between bg-white text-oxford-blue px-4">
        <span>Usage: {usage && usage.total_cost ? formatTokensOrCost(usage.total_cost, true) : 'N/A'}</span>
        <ChevronRightIcon className="h-5 w-5 text-oxford-blue" />
      </div>
    );
  }

  if (!usage) return <div className="h-full bg-white flex items-center justify-center">Loading usage statistics...</div>;

  return (
    <div className="h-full bg-white p-4">
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <BookOpenIcon className="h-5 w-5 text-oxford-blue" />
              <h3 className="text-base font-semibold leading-6 text-oxford-blue">Total Tokens</h3>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-pale-sky">Total Tokens:</span>
              <span className="font-semibold text-oxford-blue">{formatTokensOrCost(usage.total_tokens || 0)}</span>
            </div>
          </div>
          <div className="flex flex-col space-y-4 mt-4">
            <div className="flex items-center space-x-2">
              <CurrencyDollarIcon className="h-5 w-5 text-oxford-blue" />
              <h3 className="text-base font-semibold leading-6 text-oxford-blue">Total Cost</h3>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-pale-sky">Total Cost:</span>
              <span className="font-semibold text-oxford-blue">{formatTokensOrCost(usage.total_cost || 0, true)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(UsageStats);