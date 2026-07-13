import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { mlService } from '../services/ml.service';
import { historyService } from '../services/history.service';
import { predictionSchema } from '../validators/prediction.validator';
import fs from 'fs';
import path from 'path';

const router = Router();

// Middleware for validation
const validate = (schema: z.ZodSchema) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      return next(error);
    }
  };

// GET /api/health
router.get('/health', async (req, res, next) => {
  try {
    const mlHealth = await mlService.getHealth();
    res.json({
      status: 'healthy',
      node_backend: 'up',
      ml_service: mlHealth.status
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/model-info
router.get('/model-info', (req, res) => {
  try {
    const modelInfoPath = path.join(__dirname, '../../../models/v1/metrics_v1.json');
    let metrics: any = {};
    if (fs.existsSync(modelInfoPath)) {
        metrics = JSON.parse(fs.readFileSync(modelInfoPath, 'utf8'));
    }

    // Since the python model isn't returning this info dynamically, we construct a response similar to the mock for the frontend.
    res.json({
      dataset: {
        name: 'Pima Indians Diabetes Dataset',
        source: 'UCI Machine Learning Repository / Kaggle',
        rows: 768,
        features: 8,
        target: 'Outcome (0 = No Diabetes, 1 = Diabetes)',
        description: 'Diagnostic measurements from female patients of Pima Indian heritage.',
      },
      algorithms: [
        { name: 'Logistic Regression', type: 'Linear', status: 'Baseline' },
        { name: 'XGBoost', type: 'Gradient Boosting', status: 'Selected ✓' },
      ],
      metrics: {
        accuracy: metrics.accuracy || 0.604,
        precision: metrics.precision || 0.468,
        recall: metrics.recall || 0.963,
        f1: metrics.f1 || 0.630,
        roc_auc: metrics.roc_auc || 0.833,
      },
      features: [
        { name: 'Glucose', importance: 0.28 },
        { name: 'BMI', importance: 0.21 },
        { name: 'Age', importance: 0.15 },
        { name: 'DiabetesPedigreeFunction', importance: 0.12 },
        { name: 'Insulin', importance: 0.09 },
        { name: 'BloodPressure', importance: 0.07 },
        { name: 'Pregnancies', importance: 0.05 },
        { name: 'SkinThickness', importance: 0.03 },
      ],
    });
  } catch (error) {
    // If we fail to load from metrics_v1, just send a basic response
    res.json({ error: "Failed to load model info." });
  }
});

// POST /api/predict
router.post('/predict', validate(predictionSchema), async (req, res, next) => {
  try {
    const features = req.body;
    
    // Call Python ML Service
    const predictionResult = await mlService.predict(features);
    
    // Add disease info based on prediction (matching the frontend mock structure for seamless integration)
    if (predictionResult.prediction === 'Diabetes') {
        predictionResult.disease_info = {
            name: 'Type 2 Diabetes Mellitus',
            description: 'Type 2 diabetes is a chronic condition that affects the way your body metabolizes sugar (glucose).',
            symptoms: ['Increased thirst', 'Frequent urination', 'Fatigue'],
            causes: ['Insulin resistance', 'Genetics', 'Obesity'],
            prevention: ['Maintain healthy weight', 'Exercise regularly', 'Balanced diet'],
            lifestyle: ['Walk daily', 'Manage stress', 'Sleep 7-9 hours'],
            diet: ['Whole grains', 'Lean protein', 'Vegetables']
        };
    } else {
        predictionResult.disease_info = {
            name: 'No Diabetes Detected',
            description: 'Based on the provided health metrics, the AI model indicates a low probability of diabetes.',
            symptoms: [],
            causes: [],
            prevention: ['Continue maintaining a healthy lifestyle'],
            lifestyle: ['Keep up current habits'],
            diet: ['Balanced diet']
        };
    }

    // Save to history asynchronously
    historyService.addHistory({
      prediction: predictionResult.prediction,
      risk_level: predictionResult.risk_level,
      confidence_score: predictionResult.confidence_score,
      features
    }).catch(console.error);

    res.json(predictionResult);
  } catch (error) {
    next(error);
  }
});

// GET /api/history
router.get('/history', async (req, res, next) => {
  try {
    const history = await historyService.getHistory();
    res.json(history);
  } catch (error) {
    next(error);
  }
});

// POST /api/history (mostly for testing or manual inserts)
router.post('/history', async (req, res, next) => {
  try {
    const entry = await historyService.addHistory(req.body);
    res.status(201).json(entry);
  } catch (error) {
    next(error);
  }
});

export default router;
