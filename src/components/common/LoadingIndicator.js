// components/common/LoadingIndicator.js
import React from "react";

const LoadingIndicator = ({ size = "medium", color = "gray" }) => (
  <div
    className={`flex space-x-2 animate-pulse ${size === "small" ? "scale-75" : size === "large" ? "scale-125" : ""}`}
  >
    <div className={`w-2 h-2 bg-${color}-500 rounded-full`}></div>
    <div className={`w-2 h-2 bg-${color}-500 rounded-full`}></div>
    <div className={`w-2 h-2 bg-${color}-500 rounded-full`}></div>
  </div>
);

export default LoadingIndicator;
