import express from 'express';
import cookieParser from 'cookie-parser';
import { sequelize } from './database';
import { login } from './routes/login';
import { user } from './routes/user';
import { image } from './routes/image';
import { setHeadersMiddleware } from './middleware/setHeaders';
import { sessionMiddleware } from './middleware/setSession';
import { uptime } from 'process';
import { pet } from './routes/pet';

const port = 8500;

const app = express();

app.use(express.static('static'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(setHeadersMiddleware);
app.use(sessionMiddleware);

app.use((req, res, next) => {
  console.log('Time: ', Date.now())
  console.log(req.cookies);
  next()
});

app.use('/images', image);

app.use('/api', login);
app.use('/api', user);
app.use('/api', pet);
app.get('/api/status', (req, res) => {
  res.send({
    version: req.version,
    uptime: uptime(),
    loggedIn: !!req.session,
  });
});

const server = app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});

const shutdown = async () => {
  server.close();
  await sequelize.close();
};

process.once('SIGTERM', async function () {
  console.log('Stopping application');
  await shutdown();
  process.exit();
});

app.addListener('error', (error) => {
  console.log('app level error', error);
});
