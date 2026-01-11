FROM python:3.11-slim

# Copy backend requirements and install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Set working directory to app root
WORKDIR /app/backend

# Copy the entire backend directory to backend/
COPY backend/ .

EXPOSE 8000

CMD ["python", "-c", "import os; port = int(os.environ.get('PORT', 8000)); import uvicorn; from src.main import app; uvicorn.run(app, host='0.0.0.0', port=port)"]