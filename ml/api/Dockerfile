FROM python:3.10-slim

WORKDIR /app

# Install ML dependencies from root
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install API dependencies from ml_service
COPY ml_service/requirements.txt ./ml_requirements.txt
RUN pip install --no-cache-dir -r ml_requirements.txt

# Copy the shared code and assets
COPY src/ ./src/
COPY models/ ./models/
COPY config/ ./config/

# Copy the ML service code
COPY ml_service/ ./ml_service/

# Expose port
EXPOSE 5000

# Run the FastAPI app with uvicorn
WORKDIR /app/ml_service
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000"]
