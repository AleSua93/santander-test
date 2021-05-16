import express, { Request, Response } from 'express';
import dotenv  from "dotenv"

dotenv.config({ path: '.env' });

const app: express.Express = express();

app.get('/', (req: Request, res: Response) => {
    res.send('Well done!');
})

const port = process.env.PORT ?? 5000;

app.listen(port, () => {
    console.log(`The application is listening on port ${port}!`);
})