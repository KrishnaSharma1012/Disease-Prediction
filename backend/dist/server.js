"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const env_1 = require("./config/env");
const errorHandler_1 = require("./utils/errorHandler");
const api_routes_1 = __importDefault(require("./routes/api.routes"));
const history_service_1 = require("./services/history.service");
const app = (0, express_1.default)();
// Security Middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: env_1.env.FRONTEND_URL }));
// Parsing & Logging
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)('dev'));
// Routes
app.use('/api', api_routes_1.default);
// Error Handling (Must be last)
app.use(errorHandler_1.errorHandler);
// Initialize DB and start server
const startServer = async () => {
    try {
        await (0, history_service_1.initDb)();
        console.log('✅ SQLite Database initialized');
        app.listen(env_1.env.PORT, () => {
            console.log(`🚀 Node.js Backend running on http://localhost:${env_1.env.PORT}`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
