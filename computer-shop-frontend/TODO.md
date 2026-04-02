# Fix Routing: Home Always Redirects to Login

## Steps:
- [x] Step 1: Update src/App.jsx - Make `/` unprotected (public HomePage), add `/dashboard/*` protected wrapper for user pages.
- [x] Step 2: Update src/pages/login.jsx - Change navigate("/home") to navigate("/"). (Already correct, no change needed)
- [ ] Step 3: Test - Clear localStorage, `npm run dev`, visit `/` (should show home without login redirect). Login should go to `/` home.
- [ ] Step 4: Complete - attempt_completion.
