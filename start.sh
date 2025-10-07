#!/bin/bash

echo "🚀 Starting Anas Helal Campaign Website..."

# Kill any existing processes
echo "🔄 Stopping existing servers..."
pkill -f "vite" 2>/dev/null
pkill -f "node server" 2>/dev/null

# Wait a moment
sleep 2

# Start backend server
echo "🔧 Starting backend server..."
npm run server &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend server
echo "🎨 Starting frontend server..."
npm run dev &
FRONTEND_PID=$!

echo "✅ Both servers are starting..."
echo "📱 Frontend: http://localhost:8080"
echo "🔧 Backend: http://localhost:5174"
echo "📝 Admin: http://localhost:8080/admin/blog"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait
