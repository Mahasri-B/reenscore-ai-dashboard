# Deployment Guide

## Quick Deploy Options

### Option 1: Vercel (Frontend) + Render (Backend)

**Frontend on Vercel:**
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Set root directory: `frontend`
5. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = your backend URL
6. Deploy

**Backend on Render:**
1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect your repository
4. Settings:
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Deploy

### Option 2: Railway (Full Stack)

**Backend:**
1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select `backend` folder
4. Railway auto-detects Python
5. Add start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

**Frontend:**
1. New Service in same project
2. Select `frontend` folder
3. Add environment variable: `NEXT_PUBLIC_API_URL`
4. Railway auto-deploys

### Option 3: Docker (Self-Hosted)

**Backend Dockerfile:**
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Frontend Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## Environment Variables

### Frontend
- `NEXT_PUBLIC_API_URL` - Backend API URL (e.g., https://api.yourdomain.com)

### Backend
- No environment variables required (uses embedded data)

## Post-Deployment

1. Test API: `https://your-backend-url/docs`
2. Test Frontend: `https://your-frontend-url`
3. Verify map loads correctly
4. Test simulator functionality
5. Check ML insights page

## Troubleshooting

**CORS Issues:**
- Add your frontend domain to backend CORS origins in `main.py`

**Map Not Loading:**
- Check browser console for API errors
- Verify `NEXT_PUBLIC_API_URL` is set correctly

**Slow Performance:**
- Enable caching in production
- Use CDN for static assets
- Consider upgrading server resources
