export const formatTokensOrCost = (value, isCost = false) => {
  const unit = isCost ? "$" : "";
  const suffix = isCost ? "" : "";

  if (isCost) {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(2)}k`;
    } else if (value >= 1) {
      return `$${value.toFixed(1)}`; // Format as dollars with 2 decimal places
    } else {
      return `$${value.toFixed(2)}`; // Format as dollars with 4 decimal places
    }
  } else {
    // For tokens, always use whole numbers
    if (value >= 1000000) {
      return `${Math.round(value / 1000000)}M${suffix}`;
    } else if (value >= 1000) {
      return `${Math.round(value / 1000)}k${suffix}`;
    } else {
      return `${Math.round(value)}${suffix}`;
    }
  }
};
