'use strict';
// A configurable flat rate for the course exercise, not jurisdiction-specific tax rules.
function calculateTax(income, rate) {
  if (typeof income !== 'number' || !Number.isFinite(income) || income < 0 || income > 1e12) {
    throw new RangeError('Income must be a number between 0 and 1,000,000,000,000.');
  }
  if (typeof rate !== 'number' || !Number.isFinite(rate) || rate < 0 || rate > 100) {
    throw new RangeError('Tax rate must be a number between 0 and 100.');
  }
  const tax = Math.round((income * rate / 100 + Number.EPSILON) * 100) / 100;
  return { income, rate, tax, netIncome: Math.round((income - tax) * 100) / 100 };
}
module.exports = { calculateTax };
