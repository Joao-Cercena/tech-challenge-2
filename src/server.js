import app from './app.js';
import { errorHandler } from './middlewares/error-handler.js';

app.use(errorHandler);

app.listen(3000, () => {
    console.log('Server running');
});