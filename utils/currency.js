const CONVERSION_RATE = 1;
const CURRENCY_SYMBOL = '$';

const convertUsdToInr = (usdAmount) => {
  const amount = parseFloat(usdAmount) || 0;
  return amount;
};

const formatPrice = (usdAmount) => {
  const amount = parseFloat(usdAmount) || 0;
  return `${CURRENCY_SYMBOL}${amount.toFixed(2)}`;
};

module.exports = {
  CONVERSION_RATE,
  CURRENCY_SYMBOL,
  convertUsdToInr,
  formatPrice,
};

