import 'dotenv/config';
import app from './app.js';
import sequelize from './config/database.js';
import './models/index.js';
const PORT = process.env.PORT || 3000;
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully');
        app.listen(PORT, () => {
            console.log(`HTTP server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=server.js.map