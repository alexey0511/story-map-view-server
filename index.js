const express = require('express');
const session = require('express-session')
const bodyParser = require('body-parser')

const app = express();
const router = express.Router()

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

const routes = require('./routes');

app.use('/', routes)

app.listen(process.env.PORT || 3000);
