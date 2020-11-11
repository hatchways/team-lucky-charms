const { expect } = require('chai');
const validateRegisterInput = require('../validation/register');

describe('validateRegisterInput', () => {
  it('given valid credentials should return object with empty errors object and truthy isValid prop', () => {
    const credentials = { email: 'test@email.com', name: 'test', password: '111111', confirmPassword: '111111' }
    const result = validateRegisterInput(credentials);

    expect(result).to.eql({ errors: {}, isValid: true });
  })

  it('given empty credentials should return object with errors object and falsy isValid prop', () => {
    const credentials = { email: '', name: '', password: '', confirmPassword: '' }
    const result = validateRegisterInput(credentials);

    expect(result).to.eql({ errors: { email: 'Email field is required', name: 'Name field is required', password: 'Password must be at least 6 characters', confirmPassword: 'Confirm password field is required' }, isValid: false });
  })

  it('given invalid email and password should return object with errors object and falsy isValid prop', () => {
    const credentials = { email: 'test', name: 'test', password: '1', confirmPassword: '1' }
    const result = validateRegisterInput(credentials);

    expect(result).to.eql({ errors: { email: 'Email is invalid', password: 'Password must be at least 6 characters' }, isValid: false });
  })

  it('given non-matching passwords should return object with errors object and falsy isValid prop', () => {
    const credentials = { email: 'test@email.com', name: 'test', password: '123456', confirmPassword: '123457' }
    const result = validateRegisterInput(credentials);

    expect(result).to.eql({ errors: { confirmPassword: 'Passwords must match' }, isValid: false });
  })
})