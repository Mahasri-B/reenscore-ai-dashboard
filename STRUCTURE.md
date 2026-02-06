# Project Structure

```
energy-transition-dashboard/
│
├── backend/                      # FastAPI Backend
│   ├── main.py                  # API server with all endpoints
│   ├── requirements.txt         # Python dependencies
│   └── venv/                    # Virtual environment (gitignored)
│
├── frontend/                     # Next.js Frontend
│   ├── src/
│   │   ├── app/                 # Next.js 14 App Router
│   │   │   ├── page.tsx        # Dashboard home
│   │   │   ├── layout.tsx      # Root layout
│   │   │   ├── globals.css     # Global styles
│   │   │   ├── providers.tsx   # React Query provider
│   │   │   ├── ml-insights/    # ML analysis page
│   │   │   ├── simulator/      # Scenario simulator
│   │   │   └── rankings/       # State rankings
│   │   │
│   │   ├── components/          # Reusable components
│   │   │   ├── Navbar.tsx      # Navigation bar
│   │   │   └── IndiaMap.tsx    # Interactive map
│   │   │
│   │   └── lib/                 # Utilities
│   │       └── api.ts          # API client functions
│   │
│   ├── package.json             # Node dependencies
│   ├── tailwind.config.ts       # Tailwind configuration
│   ├── tsconfig.json           # TypeScript config
│   ├── next.config.js          # Next.js config
│   ├── .env.local              # Environment variables (gitignored)
│   └── node_modules/           # Dependencies (gitignored)
│
├── .gitignore                   # Git ignore rules
├── README.md                    # Project documentation
├── DEPLOY.md                    # Deployment guide
├── STRUCTURE.md                 # This file
└── start.bat                    # Windows startup script
```

## Key Files

### Backend
- **main.py**: Complete FastAPI server with ML models, data processing, and API endpoints

### Frontend
- **page.tsx**: Main dashboard with India map and state statistics
- **simulator/page.tsx**: Renewable energy scenario modeling with AI recommendations
- **rankings/page.tsx**: State rankings with podium and detailed table
- **ml-insights/page.tsx**: K-Means, GMM, and Isolation Forest analysis
- **IndiaMap.tsx**: D3.js-based interactive India map with TopoJSON
- **api.ts**: Centralized API client with React Query integration

## Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts
- D3.js
- Axios
- React Query

**Backend:**
- FastAPI
- Python 3.11+
- scikit-learn
- pandas
- numpy
- uvicorn

## Development Workflow

1. Start backend: `cd backend && python main.py`
2. Start frontend: `cd frontend && npm run dev`
3. Access dashboard: `http://localhost:3000`
4. API docs: `http://localhost:8000/docs`
