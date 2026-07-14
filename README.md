# 🏥 AI-Powered Disease Prediction System

A full-stack application that leverages Machine Learning to predict disease probability based on patient health metrics.

## 🚀 How to Run the Project

The easiest way to run the entire project is using **Docker**. If you don't have Docker, you can run the services manually.

### Method 1: Using Docker (Recommended)
Make sure you have Docker and Docker Compose installed.

1. Open a terminal in the root folder of the project.
2. Run the following command:
   ```bash
   docker-compose up --build
   ```
3. Once all services start, open your browser and go to:
   - **Frontend UI**: [http://localhost](http://localhost) (or [http://localhost:80](http://localhost:80))

*(Note: The Node.js backend runs on port 3000, and the ML prediction service runs on port 5000).*

---

### Method 2: Running Manually

If you prefer to run the services individually without Docker, you will need 3 separate terminal windows:

**1. Start the Machine Learning API (Python)**
```bash
# From the root folder of the project
pip install -r requirements.txt
pip install -r ml_service/requirements.txt
cd ml_service
uvicorn main:app --port 5000
```

**2. Start the Backend API (Node.js)**
```bash
# Open a new terminal from the root folder
cd backend
npm install
npm run build
npm start
```

**3. Start the Frontend UI (React)**
```bash
# Open a new terminal from the root folder
cd frontend
npm install
npm run dev
```
Then, open the local link provided by the terminal (usually `http://localhost:5173`) in your browser.