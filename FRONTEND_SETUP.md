# Delish Restaurant Frontend - setup

This bundle contains the complete `src` folder for the React/Vite frontend.

## Install dependencies

Run these inside your existing `restaurant-frontend` project:

```bash
npm install react-router-dom axios
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
```

## Use the files

1. Back up your existing `src` folder if you want.
2. Replace the contents of your existing `src` folder with the files from this bundle.
3. Run:

```bash
npm run dev
```

## Demo accounts

Customer:
- Email: customer@delish.com
- Password: Customer123!

Admin:
- Email: admin@delish.com
- Password: Admin123!

## Important

This is FRONTEND DEMO authentication only. Passwords and app data are stored in browser localStorage for now.
When the Express/PostgreSQL backend is built, replace this with real API calls, hashed passwords and JWT authentication.
