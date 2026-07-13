"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.predictionSchema = void 0;
const zod_1 = require("zod");
exports.predictionSchema = zod_1.z.object({
    body: zod_1.z.object({
        Pregnancies: zod_1.z.number().min(0),
        Glucose: zod_1.z.number().min(0),
        BloodPressure: zod_1.z.number().min(0),
        SkinThickness: zod_1.z.number().min(0),
        Insulin: zod_1.z.number().min(0),
        BMI: zod_1.z.number().min(0),
        DiabetesPedigreeFunction: zod_1.z.number().min(0),
        Age: zod_1.z.number().min(1),
    })
});
