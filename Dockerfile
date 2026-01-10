FROM python:3.11-slim

# Copy backend requirements and install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Set working directory to app root
WORKDIR /app

# Copy the entire backend directory to backend/
COPY backend/ ./backend/

# Change working directory to backend
WORKDIR /app/backend

EXPOSE 8000

CMD ["sh", "-c", "uvicorn src.main:app --host 0.0.0.0 --port ${PORT:-8000}"]