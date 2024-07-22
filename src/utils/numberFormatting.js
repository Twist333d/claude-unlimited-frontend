export const formatTokensOrCost = (value, isCost = false) => {
  const unit = isCost ? '$' : '';
  const suffix = isCost ? '' : ' tokens';

  if (isCost) {
    if (value >= 1000000) {
      return `${unit}${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `${unit}${(value / 1000).toFixed(2)}k`;
    } else if (value >= 1) {
      return `${unit}${value.toFixed(2)}`;
    } else {
      return `${unit}${value.toFixed(4)}`;
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