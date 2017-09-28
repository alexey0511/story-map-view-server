import express from 'express';
import session from'express-session';
import bodyParser from 'body-parser';
import path from 'path';
import routes from './routes'
const app = express();

app.use(bodyParser.json())


app.use(session({
  genid: function(req) {
    return genuuid() // use UUIDs for session IDs
  },
  resave: true,
  saveUninitialized: true,
  secret: 'the secret',
  cookie: { secure: false }
}))

const genuuid = () => {
  function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}
return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
  s4() + '-' + s4() + s4() + s4();
}

app.set('trust proxy', 1) // trust first proxy


app.use('/', routes)
// TODO: client path should be handled by nginx rather than express ....
app.use(express.static(path.join(__dirname, './client')));

app.listen(process.env.PORT || 3000);
