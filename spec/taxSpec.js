const { calculateTax } = require('../src/tax');
describe('Tax calculation', () => {
  it('calculates tax and net income', () => expect(calculateTax(50000, 20)).toEqual({income:50000,rate:20,tax:10000,netIncome:40000}));
  it('handles zero income', () => expect(calculateTax(0,20).tax).toBe(0));
  it('handles a zero rate', () => expect(calculateTax(150,0).netIncome).toBe(150));
  it('handles a 100 percent rate', () => expect(calculateTax(150,100).netIncome).toBe(0));
  it('rounds to cents', () => expect(calculateTax(123.45,17.5).tax).toBe(21.6));
  for (const income of [-1, NaN, Infinity, '100', null, 1e13]) {
    it(`rejects invalid income ${income}`, () => expect(() => calculateTax(income,20)).toThrowError(RangeError));
  }
  for (const rate of [-1,101,NaN,Infinity,'20',null]) {
    it(`rejects invalid rate ${rate}`, () => expect(() => calculateTax(100,rate)).toThrowError(RangeError));
  }
});
