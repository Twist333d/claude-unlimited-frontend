// src/components/common/ErrorToast.js
import React, { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { ERROR_TYPES } from "../../utils/errorHandler";

const getIconForErrorType = (type) => {
  // Import and return appropriate icon based on error type
  // For example: return <ExclamationCircleIcon className="h-6 w-6 text-red-400" />;
};

const getColorForErrorType = (type) => {
  switch (type) {
    case ERROR_TYPES.NETWORK_ERROR:
      return "red";
    case ERROR_TYPES.SERVER_ERROR:
      return "orange";
    case ERROR_TYPES.AUTH_ERROR:
      return "yellow";
    case ERROR_TYPES.VALIDATION_ERROR:
      return "blue";
    default:
      return "gray";
  }
};

const ErrorToast = ({ error, onClose }) => {
  const [show, setShow] = useState(true);
  const color = getColorForErrorType(error.type);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <Transition show={show}>
      <div
        className={`pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition data-[closed]:data-[enter]:translate-y-2 data-[enter]:transform data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-100 data-[enter]:ease-out data-[leave]:ease-in data-[closed]:data-[enter]:sm:translate-x-2 data-[closed]:data-[enter]:sm:translate-y-0`}
      >
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {getIconForErrorType(error.type)}
            </div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
              <p className={`text-sm font-medium text-${color}-900`}>
                {error.type}
              </p>
              <p className="mt-1 text-sm text-gray-500">{error.message}</p>
            </div>
            <div className="ml-4 flex flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  setShow(false);
                  onClose();
                }}
                className={`inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-${color}-500 focus:ring-offset-2`}
              >
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
};

export default ErrorToast;
