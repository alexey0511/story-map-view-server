'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.use(_bodyParser2.default.json());

app.use((0, _expressSession2.default)({
  genid: function genid(req) {
    return genuuid(); // use UUIDs for session IDs
  },
  resave: true,
  saveUninitialized: true,
  secret: 'the secret',
  cookie: { secure: false }
}));

var genuuid = function genuuid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

app.set('trust proxy', 1); // trust first proxy


app.use('/', _routes2.default);
// TODO: client path should be handled by nginx rather than express ....
app.use(_express2.default.static(_path2.default.join(__dirname, './client')));

app.listen(process.env.PORT || 3000);
//# sourceMappingURL=server.js.map