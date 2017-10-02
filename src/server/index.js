import express from 'express';
import session from'express-session';
import bodyParser from 'body-parser';
import path from 'path';
import routes from './routes'
import { genuuid } from './utils'

const app = express();
app.use(bodyParser.json())


app.use(session({
  genid: () => genuuid(),
  resave: true,
  saveUninitialized: true,
  secret: 'the secret',
  cookie: { secure: false }
}))


app.set('trust proxy', 1) // trust first proxy

if (process.env.NODE_ENV === 'production') {
  // TODO: client path should be handled by nginx rather than express ....
  app.use(express.static(path.join(__dirname, './client')));
}

app.use('/api', routes);

app.listen(process.env.PORT || 8081);
