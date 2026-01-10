FROM python:3.11-slim

# Copy backend requirements and install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Set working directory to app root
WORKDIR /app

# Copy the entire backend directory to backend/
COPY backend/ ./backend/

# Set PYTHONPATH to include the backend directory
ENV PYTHONPATH=/app/backend:$PYTHONPATH

EXPOSE 8000

CMD ["uvicorn", "backend.src.main:app", "--host", "0.0.0.0", "--port", "8000"]