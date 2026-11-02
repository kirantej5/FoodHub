# Security Policy

## Reporting a vulnerability

Please do not open a public issue for a security vulnerability. Contact the repository owner privately through GitHub and include reproduction steps, affected files, and a suggested mitigation when available.

Never include real credentials, production database URLs, payment data, or private user data in issues, logs, or pull requests.

## Local security guidance

- Keep `.env` files untracked.
- Use a strong `JWT_SECRET` outside local development.
- Change seeded demo credentials before using non-local data.
- Restrict Cloudinary and MongoDB credentials to the environments that need them.
