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

if (process.env.NODE_ENV !== 'production') {
  // use require for conditional input
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const clientConfig = require('../../webpack.client.config');
  const compiler = webpack(clientConfig);
  app.use(webpackDevMiddleware(compiler, {
      noInfo: true,
      publicPath: clientConfig.output.publicPath
  }));
  app.use(webpackHotMiddleware(compiler));


  // FIXME: should be in same dirs for prod and dev
  // and work same way
  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/index.html'));
  });
} else {
  // TODO: client path should be handled by nginx rather than express ....
  app.use(express.static(path.join(__dirname, './client')));
}


app.use('/', routes)

app.listen(process.env.PORT || 3000);
