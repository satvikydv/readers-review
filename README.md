# Book Review Frontend

This is the React + TypeScript frontend for the Book Review platform, integrated with the backend API.

## Features
- User registration and login
- Book listing and details
- Submit and view reviews
- User profile page
- Responsive design with Tailwind CSS

## Prerequisites
- Node.js (v16 or higher recommended)
- Backend API running (see `../server/README.md` for backend setup)

## Setup Instructions

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Configure environment variables:**
   - Create a `.env` file in the `frontend-new` directory:
     ```env
     VITE_API_BASE_URL=http://localhost:5000/api
     ```
   - Adjust the URL if your backend runs elsewhere.

3. **Start the development server:**
   ```sh
   npm run dev
   ```
   The app will be available at [http://localhost:5173](http://localhost:5173) by default.

4. **Build for production:**
   ```sh
   npm run build
   ```

## Tailwind CSS
- This project uses Tailwind CSS for styling.
- If you see errors about `@tailwind base;`, make sure you are using Tailwind v3. If you accidentally upgraded to v4, reinstall v3:
  ```sh
  npm install tailwindcss@^3
  ```
- The main CSS file is `src/index.css`.

## API Integration
- All API calls are made to the backend specified by `VITE_API_BASE_URL`.
- Make sure your backend server is running and accessible.

## Common Troubleshooting
- **CORS errors:** Ensure your backend allows requests from the frontend's origin.
- **Tailwind errors:** Double-check your Tailwind version and config files.
- **API errors:** Check the browser console and network tab for error messages from the backend.

## Project Structure
```
frontend-new/
  src/
    api.ts            # API service
    contexts/         # React context providers
    pages/            # App pages (Login, Register, Books, Profile, etc.)
    components/       # Shared components (Layout, etc.)
    index.css         # Tailwind CSS entry
    App.tsx           # Main app with routing
  tailwind.config.js  # Tailwind config
  postcss.config.js   # PostCSS config
  README.md           # This file
```

## License
MIT
