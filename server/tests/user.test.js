import bcrypt from 'bcryptjs';
import User from '../models/User.js';

describe('User password behavior', () => {
  it('matches a hashed password without requiring a database', async () => {
    const user = new User({ name: 'Test User', email: 'test@example.com', password: await bcrypt.hash('secret123', 4) });
    await expect(user.matchPassword('secret123')).resolves.toBe(true);
    await expect(user.matchPassword('wrong-password')).resolves.toBe(false);
  });
});
