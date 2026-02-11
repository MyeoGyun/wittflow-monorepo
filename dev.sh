#!/bin/bash

# Wittflow Monorepo Development Script
# Starts both Django Backend and Next.js Frontend

# Function to handle script termination (Ctrl+C)
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $(jobs -p) 2>/dev/null
    exit
}

# Trap SIGINT (Ctrl+C) and SIGTERM
trap cleanup SIGINT SIGTERM EXIT

echo "🚀 Starting Wittflow Development Environment..."
echo "==============================================="

# 1. Start Django Backend
echo "🐍 Starting Django API (http://localhost:8000)..."
# Check if venv python exists, else assume globally or adapt
if [ -f "apps/api/venv/bin/python" ]; then
    APPS_PYTHON="apps/api/venv/bin/python"
else
    echo "⚠️  Virtual environment python not found at apps/api/venv/bin/python."
    echo "   Using system 'python' (ensure requirements are installed)..."
    APPS_PYTHON="python"
fi

$APPS_PYTHON apps/api/manage.py runserver 0.0.0.0:8000 &
BACKEND_PID=$!

# 2. Start Next.js Frontend
echo "⚛️  Starting Web Frontend (http://localhost:3000)..."
(cd apps/web && pnpm dev) &
FRONTEND_PID=$!

echo "==============================================="
echo "✅ Both servers are running in background."
echo "📝 Logs will appear below mixed together."
echo "👉 Press Ctrl+C to stop all servers."
echo "==============================================="

# Wait for processes
wait $BACKEND_PID $FRONTEND_PID
