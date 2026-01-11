#!/bin/sh
# Startup script for Railway deployment

# Set default port if not provided
PORT=${PORT:-8000}

echo "Starting application on port $PORT"

# Run the uvicorn server
exec uvicorn src.main:app --host 0.0.0.0 --port $PORT