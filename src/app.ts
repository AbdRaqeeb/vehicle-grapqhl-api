import * as express from 'express';
import { Application, Request, Response } from 'express';
import * as cors from 'cors';
import sequelize from './database';
import server from './graphql';

const app: Application = express();

// enable cors
app.use(cors());

sequelize
  .sync()
  .then(() => console.log('Database connected'))
  .catch((err) => console.log(`Err: ${err}`));

server.applyMiddleware({ app, path: '/graphql' });

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Hello world',
  });
});

export default app;
