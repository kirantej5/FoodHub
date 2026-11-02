import { validationResult } from 'express-validator';
import { loginValidator, registerValidator } from '../validators/authValidator.js';

async function errorsFor(validators, body) {
  const request = { body };
  for (const validator of validators) await validator.run(request);
  return validationResult(request).array();
}

describe('Authentication validators', () => {
  it('rejects invalid registration input', async () => {
    const errors = await errorsFor(registerValidator, { name: '', email: 'invalid', password: '123' });
    expect(errors.map(error => error.path)).toEqual(expect.arrayContaining(['name', 'email', 'password']));
  });

  it('accepts valid login input and normalizes email', async () => {
    const body = { email: 'USER@EXAMPLE.COM', password: 'secret123' };
    const errors = await errorsFor(loginValidator, body);
    expect(errors).toHaveLength(0);
    expect(body.email).toBe('user@example.com');
  });
});
