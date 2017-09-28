import express from 'express';
import session from'express-session';
import bodyParser from 'body-parser';
import routes from './routes'
import path from 'path'
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

app.use(express.static(path.join(__dirname, 'public')));

app.listen(process.env.PORT || 3000);
