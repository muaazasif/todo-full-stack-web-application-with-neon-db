FROM python:3.11-slim

# Copy backend requirements and install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Set working directory to app root
WORKDIR /app

# Copy the entire backend directory to backend/
COPY backend/ ./backend/

EXPOSE 8000

# Create a dedicated startup script
RUN echo '#!/usr/bin/env python3' > start_server.py && \
    echo 'import os' >> start_server.py && \
    echo 'import uvicorn' >> start_server.py && \
    echo 'from backend.src.main import app' >> start_server.py && \
    echo 'port = int(os.environ.get("PORT", 8000))' >> start_server.py && \
    echo 'print(f"Starting server on port {port}")' >> start_server.py && \
    echo 'uvicorn.run(app, host="0.0.0.0", port=port)' >> start_server.py

CMD ["python", "start_server.py"]