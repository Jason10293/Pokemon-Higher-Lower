Migration from Supabase to PostgreSQL + Auth.js is complete.

Remaining work:
- Set up Google OAuth credentials in Google Cloud Console
- Add production DATABASE_URL for deployment
- Add backend auth validation middleware (verify JWT on protected routes) if needed
- Manual verification: signup, login, Google OAuth, profile update, sign out
