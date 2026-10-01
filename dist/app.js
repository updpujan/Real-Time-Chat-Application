import express from 'express';
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', './src/views');
export default app;
//# sourceMappingURL=app.js.map