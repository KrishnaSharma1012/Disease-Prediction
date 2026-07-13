import { z } from 'zod';

export const predictionSchema = z.object({
  body: z.object({
    Pregnancies: z.number().min(0),
    Glucose: z.number().min(0),
    BloodPressure: z.number().min(0),
    SkinThickness: z.number().min(0),
    Insulin: z.number().min(0),
    BMI: z.number().min(0),
    DiabetesPedigreeFunction: z.number().min(0),
    Age: z.number().min(1),
  })
});
