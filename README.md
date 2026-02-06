# GreenScore AI

Enterprise-grade renewable energy readiness dashboard for Indian States & Union Territories.

## Features

- **Interactive Dashboard** - Real-time state rankings with India map visualization
- **ML Insights** - K-Means, GMM, and Isolation Forest clustering analysis
- **Scenario Simulator** - Model renewable energy capacity additions with AI recommendations
- **State Rankings** - Comprehensive performance metrics and comparisons

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: FastAPI, Python 3.11+
- **ML**: scikit-learn, pandas, numpy
- **Visualization**: Recharts, D3.js

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+

### Installation

1. **Backend Setup**
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
python main.py
```

Backend runs on `http://localhost:8000`

2. **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

### Environment Variables

Create `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Project Structure

```
energy-transition-dashboard/
├── backend/
│   ├── main.py              # FastAPI server
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js pages
│   │   ├── components/     # React components
│   │   └── lib/            # API utilities
│   ├── package.json
│   └── tailwind.config.ts
└── README.md
```

## Deployment

### Frontend (Vercel)
1. Push to GitHub
2. Import to Vercel
3. Set `NEXT_PUBLIC_API_URL` environment variable
4. Deploy

### Backend (Render/Railway)
1. Push to GitHub
2. Create new web service
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Deploy

## License

MIT
