FROM python:3.10-slim

WORKDIR /app

# Install ML training dependencies (global)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install API specific dependencies
COPY api/requirements.txt ./api_requirements.txt
RUN pip install --no-cache-dir -r api_requirements.txt

# Copy all the ML folders (models, data, config, etc.)
COPY . .

# Expose port
EXPOSE 5000

# Run the FastAPI app with uvicorn (set workdir to the api folder where main.py lives)
WORKDIR /app/api
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000"]
