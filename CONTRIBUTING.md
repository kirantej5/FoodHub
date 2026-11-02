# Contributing to FoodHub

## Development setup

Follow the setup steps in the [README](README.md), then run the backend and frontend locally with `npm run dev`.

## Before opening a pull request

```bash
cd server && npm test
cd ../client && npm run lint && npm run build
```

Describe database or environment-variable changes in the pull request. Never commit `.env` files, credentials, uploads, or generated `client/dist` output.

## Pull requests

- Keep changes focused and explain user-visible behavior.
- Include screenshots for visual changes.
- Add or update tests for changed behavior.
- Use clear, conventional commit messages where practical.
