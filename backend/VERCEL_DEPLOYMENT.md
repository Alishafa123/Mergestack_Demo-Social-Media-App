# Vercel Deployment Guide

## ✅ What Changed

Your Express backend has been converted to work with Vercel's serverless architecture:

1. **Created `api/index.ts`** - Serverless entry point (replaces `server.ts`)
2. **Added `vercel.json`** - Vercel configuration
3. **Updated database config** - Lazy loading for serverless
4. **Added DB middleware** - Ensures connection before requests
5. **Updated `app.ts`** - Uses DB middleware for all API routes

## 🚀 Deploy to Vercel

### 1. Install Vercel CLI (optional)
```bash
npm i -g vercel
```

### 2. Set Environment Variables in Vercel Dashboard

Go to: **Project Settings → Environment Variables**

Add these variables:
- `DATABASE_URL` - Your PostgreSQL connection string
- `FRONTEND_URL` - Your frontend URL (e.g., https://yourapp.vercel.app)
- `JWT_SECRET` - Your JWT secret key
- `NODE_ENV` - Set to `production`

### 3. Deploy

**Option A: Via Vercel Dashboard**
1. Connect your GitHub repo
2. Vercel auto-detects the backend folder
3. Click Deploy

**Option B: Via CLI**
```bash
cd backend
vercel --prod
```

## 🔗 API Endpoints

After deployment, your API will be available at:
```
https://your-project.vercel.app/api/auth/login
https://your-project.vercel.app/api/posts
https://your-project.vercel.app/api/users
https://your-project.vercel.app/test
```

## 🧪 Test Your Deployment

```bash
curl https://your-project.vercel.app/test
# Should return: {"ok":true,"env":"production"}
```

## ⚠️ Important Notes

### Database Connections
- Serverless functions create new connections per request
- The lazy loading pattern prevents connection spam
- Consider using connection pooling (PgBouncer) for production

### Cold Starts
- First request may be slow (~1-2s)
- Subsequent requests are fast
- This is normal for serverless

### Local Development
You can still use `server.ts` for local development:
```bash
npm run dev:nodemon
```

The serverless handler (`api/index.ts`) is only used on Vercel.

## 🎯 Alternative: Railway (Recommended for Express + Sequelize)

If you experience issues with Vercel's serverless limitations, consider Railway:

**Why Railway is better for this stack:**
- ✅ Traditional server (no serverless limitations)
- ✅ Better for long-running connections
- ✅ Easier database management
- ✅ No cold starts
- ✅ Free tier available

**Deploy to Railway:**
1. Go to https://railway.app
2. Connect GitHub repo
3. Select backend folder
4. Add environment variables
5. Deploy

Railway will use your existing `server.ts` without modifications.

## 📝 Troubleshooting

### Error: "FUNCTION_INVOCATION_FAILED"
- Check environment variables are set
- Check database connection string
- View logs in Vercel dashboard

### Error: "Database connection failed"
- Ensure DATABASE_URL is correct
- Check if database allows external connections
- Verify database is running

### Error: "Module not found"
- Run `npm install` locally
- Ensure all dependencies are in `dependencies` (not `devDependencies`)
- Redeploy

## 🔄 Rollback

If you need to revert changes:
1. The original `server.ts` is still intact
2. Just remove `api/index.ts` and `vercel.json`
3. Deploy to a traditional hosting service instead
