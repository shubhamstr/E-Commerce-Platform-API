const CONVERSION_RATE = 80;

const convertUsdToInr = (usdAmount) => {
  const amount = parseFloat(usdAmount) || 0;
  return amount * CONVERSION_RATE;
};

const formatPrice = (usdAmount) => {
  const inrAmount = convertUsdToInr(usdAmount);
  return `₹${inrAmount.toFixed(2)}`;
};

module.exports = {
  CONVERSION_RATE,
  convertUsdToInr,
  formatPrice,
};
