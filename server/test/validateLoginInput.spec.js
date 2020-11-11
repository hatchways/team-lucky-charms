const { expect } = require('chai');
const validateLoginInput = require('../validation/login');

describe('validateLoginInput', () => {
  it('given valid credentials should return object with empty errors object and truthy isValid prop', () => {
    const credentials = { email: 'test@email.com', password: '111111' }
    const result = validateLoginInput(credentials);

    expect(result).to.eql({ errors: {}, isValid: true });
  })

  it('given invalid email should return object with errors object and falsy isValid prop', () => {
    const credentials = { email: 'test', password: '111111' }
    const result = validateLoginInput(credentials);

    expect(result).to.eql({ errors: { email: 'Email is invalid' }, isValid: false });
  })

  it('given empty credentials should return object with errors object and falsy isValid prop', () => {
    const credentials = { email: '', password: '' }
    const result = validateLoginInput(credentials);

    expect(result).to.eql({ errors: { email: 'Email field is required', password: 'Password field is required' }, isValid: false });
  })
})