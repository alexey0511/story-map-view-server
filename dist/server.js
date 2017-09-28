/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _express = __webpack_require__(0);

var _express2 = _interopRequireDefault(_express);

var _expressSession = __webpack_require__(2);

var _expressSession2 = _interopRequireDefault(_expressSession);

var _bodyParser = __webpack_require__(3);

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _path = __webpack_require__(4);

var _path2 = _interopRequireDefault(_path);

var _routes = __webpack_require__(5);

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

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("express-session");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

__webpack_require__(6);

var _express = __webpack_require__(0);

var _express2 = _interopRequireDefault(_express);

var _requestPromise = __webpack_require__(7);

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _utils = __webpack_require__(8);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                           * TODO
                                                                                                                                                                                                                                                                                                                                                                                                                                                                           * Implement project error responses
                                                                                                                                                                                                                                                                                                                                                                                                                                                                           * manage github limit
                                                                                                                                                                                                                                                                                                                                                                                                                                                                           * use csrf tokens
                                                                                                                                                                                                                                                                                                                                                                                                                                                                           *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                           */

// Required in order to use 'import'


var SERVICES = {
  GITHUB: 'https://api.github.com',
  GITLAB_EXTERNAL: 'https://gitlab.catalyst.net.nz',
  REDMINE: 'https://redmine.catalyst.net.nz'
};

var router = _express2.default.Router();

router.use((0, _utils.asyncMiddleware)(function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // run for any & all requests
            res.header('Access-Control-Allow-Origin', 'https://alexey0511.github.io');
            res.header('Access-Control-Allow-Credentials', 'true');
            res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

            // handle options, because e.g. redmine can't handle it
            if (req.method === 'OPTIONS') {
              res.sendStatus(200);
            } else {
              next();
            }

          case 5:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}()));
router.route('/login/github').post((0, _utils.asyncMiddleware)(function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res, next) {
    var github_creds;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            //TODO: call redmine for auth
            github_creds = new Buffer(req.body.username + ':' + req.body.password).toString('base64');

            req.session.github_auth = 'Basic ' + github_creds;
            res.sendStatus(200);

          case 3:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}()));

router.route('/login/gitlab-external').post((0, _utils.asyncMiddleware)(function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res, next) {
    var data;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return (0, _requestPromise2.default)({
              method: 'POST',
              uri: SERVICES.GITLAB_EXTERNAL + '/oauth/token',
              formData: { username: req.body.username, password: req.body.password, grant_type: "password" }
            });

          case 2:
            data = _context3.sent;

            req.session.gitlab_token = '' + JSON.parse(data).access_token;
            res.sendStatus(200);

          case 5:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function (_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}()));

router.route('/login/redmine').post((0, _utils.asyncMiddleware)(function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res, next) {
    var creds;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            //TODO: call redmine for auth
            creds = new Buffer(req.body.username + ':' + req.body.password).toString('base64');

            req.session.redmine_auth = 'Basic ' + creds;
            res.sendStatus(200);

          case 3:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function (_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}()));

router.route('/is-authenticated/:service').get((0, _utils.asyncMiddleware)(function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res, next) {
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.t0 = req.params.service;
            _context5.next = _context5.t0 === 'gitlab-external' ? 3 : _context5.t0 === 'redmine' ? 5 : _context5.t0 === 'github' ? 7 : 9;
            break;

          case 3:
            if (req.session.gitlab_token) {
              res.json(true);
            } else {
              res.json(false);
            }
            return _context5.abrupt('break', 11);

          case 5:
            if (req.session.redmine_auth) {
              res.json(true);
            } else {
              res.json(false);
            }
            return _context5.abrupt('break', 11);

          case 7:
            if (req.session.github_auth) {
              res.json(true);
            } else {
              res.json(false);
            }
            return _context5.abrupt('break', 11);

          case 9:
            console.log("SERVICE", req.params.service);
            res.sendStatus(404);

          case 11:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  }));

  return function (_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}()));

router.route('/logout').get(function (req, res) {
  req.session.auth = null;

  req.session.isLoggedIn = false;
  res.sendStatus(200);
});

router.route('/projects/github').get((0, _utils.asyncMiddleware)(function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(req, res, next) {
    var data;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return (0, _requestPromise2.default)({
              uri: SERVICES.GITHUB + '/user/repos',
              headers: {
                'Authorization': req.session.github_auth,
                'User-Agent': 'smv'
              },
              json: true
            });

          case 2:
            data = _context6.sent;


            res.setHeader('content-type', 'application/json');
            res.json(data.map(function (p) {
              return { id: p.full_name, name: p.name };
            }));

          case 5:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  }));

  return function (_x16, _x17, _x18) {
    return _ref6.apply(this, arguments);
  };
}()));

router.route('/projects/gitlab-external').get((0, _utils.asyncMiddleware)(function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(req, res, next) {
    var data;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return (0, _requestPromise2.default)({
              uri: SERVICES.GITLAB_EXTERNAL + '/api/v4/projects?access_token=' + req.session.gitlab_token,
              json: true
            });

          case 2:
            data = _context7.sent;


            res.setHeader('content-type', 'application/json');
            res.json(data);

          case 5:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, undefined);
  }));

  return function (_x19, _x20, _x21) {
    return _ref7.apply(this, arguments);
  };
}()));

router.route('/projects/redmine').get((0, _utils.asyncMiddleware)(function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(req, res, next) {
    var data;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return (0, _requestPromise2.default)({
              uri: SERVICES.REDMINE + '/projects.json',
              headers: {
                'Authorization': req.session.redmine_auth
              },
              json: true
            });

          case 2:
            data = _context8.sent;


            res.setHeader('content-type', 'application/json');
            res.json(data.projects.map(function (p) {
              return {
                id: p.id,
                name: p.name
              };
            }));

          case 5:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, undefined);
  }));

  return function (_x22, _x23, _x24) {
    return _ref8.apply(this, arguments);
  };
}()));

router.route('/fetch-view-data/github').get((0, _utils.asyncMiddleware)(function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(req, res, next) {
    var github_urls, github_promises, data;
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            github_urls = [SERVICES.GITHUB + '/repos/' + req.query.project + '/issues', SERVICES.GITHUB + '/repos/' + req.query.project + '/labels', SERVICES.GITHUB + '/repos/' + req.query.project + '/milestones'];
            github_promises = github_urls.map(function (url) {
              return (0, _requestPromise2.default)({
                uri: url,
                headers: {
                  'Authorization': req.session.github_auth,
                  'User-Agent': 'smv'
                },
                json: true
              });
            });
            _context9.next = 4;
            return Promise.all(github_promises);

          case 4:
            data = _context9.sent;


            res.json({
              steps: data[1].reverse(),
              releases: data[2].reverse(),
              issues: data[0].map(function (i) {
                return {
                  title: i.title,
                  milestone: i.milestone.title,
                  labels: i.labels.map(function (l) {
                    return l.name;
                  }),
                  user: i.user.login,
                  id: i.id
                };
              }).reverse()
            });

          case 6:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, undefined);
  }));

  return function (_x25, _x26, _x27) {
    return _ref9.apply(this, arguments);
  };
}()));

router.route('/fetch-view-data/gitlab-external').get((0, _utils.asyncMiddleware)(function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(req, res, next) {
    var access_token, urls, promises, data;
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            access_token = req.session.gitlab_token;
            urls = [SERVICES.GITLAB_EXTERNAL + '/api/v4/projects/' + req.query.project + '/issues?access_token=' + access_token, SERVICES.GITLAB_EXTERNAL + '/api/v4/projects/' + req.query.project + '/labels?access_token=' + access_token, SERVICES.GITLAB_EXTERNAL + '/api/v4/projects/' + req.query.project + '/milestones?access_token=' + access_token];
            promises = urls.map(function (url) {
              return (0, _requestPromise2.default)({
                uri: url,
                json: true
              });
            });
            _context10.next = 5;
            return promises;

          case 5:
            data = _context10.sent;

            res.setHeader('content-type', 'application/json');
            res.json({
              issues: data[0].map(function (i) {
                return {
                  title: i.title,
                  milestone: i.milestone.title,
                  labels: i.labels,
                  user: i.author.name,
                  id: i.id
                };
              }),
              steps: data[1].reverse(),
              releases: data[2].reverse()
            });

          case 8:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, undefined);
  }));

  return function (_x28, _x29, _x30) {
    return _ref10.apply(this, arguments);
  };
}()));

router.route('/fetch-view-data/redmine').get((0, _utils.asyncMiddleware)(function () {
  var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(req, res, next) {
    var options, data, issues, steps, uniquesteps, releases, uniquereleases;
    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            options = {
              uri: SERVICES.REDMINE + '/issues.json?project_id=' + req.query.project + '&include=relations',
              headers: {
                'Authorization': req.session.redmine_auth
              },
              json: true
            };
            _context11.next = 3;
            return (0, _requestPromise2.default)(options);

          case 3:
            data = _context11.sent;
            issues = data.issues;
            steps = issues.filter(function (i) {
              return !!i.category;
            }).map(function (i) {
              return { name: i.category.name, id: i.category.id };
            });
            uniquesteps = steps.filter((0, _utils.uniqFilterAccordingToProp)('id'));
            releases = issues.filter(function (m) {
              return !!m.release && !!m.release.release;
            }).map(function (i, id) {
              return { title: i.release.release.name, id: i.release.release.id, number: -1 * id };
            });
            uniquereleases = releases.filter((0, _utils.uniqFilterAccordingToProp)('id'));


            res.json({
              steps: uniquesteps,
              releases: uniquereleases,
              issues: issues.map(function (i) {
                return {
                  title: i.subject,
                  milestone: !!i.release && !!i.release.release ? i.release.release.name : null,
                  labels: [i.category ? i.category.name : null],
                  user: i.author.name,
                  id: i.id
                };
              })
            });

          case 10:
          case 'end':
            return _context11.stop();
        }
      }
    }, _callee11, undefined);
  }));

  return function (_x31, _x32, _x33) {
    return _ref11.apply(this, arguments);
  };
}()));

var handleErrors = function handleErrors(e, service, req, res) {
  res.status(e.statusCode).send(e);
};

exports.default = router;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("babel-polyfill");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("request-promise");

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var asyncMiddleware = exports.asyncMiddleware = function asyncMiddleware(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(function (e) {
      if (e && e.statusCode === 401) {
        cleanSession(req);
      }
      next();
    });
  };
};

var cleanSession = exports.cleanSession = function cleanSession(req) {
  if (req.path.includes('redmine')) {
    req.session.redmine_auth = null;
  }

  if (req.path.includes('gitlab-external')) {
    req.session.gitlab_token = null;
  }

  if (req.path.includes('github')) {
    req.session.github_auth = null;
  }
};

var uniqFilterAccordingToProp = exports.uniqFilterAccordingToProp = function uniqFilterAccordingToProp(prop) {
  if (prop) {
    return function (ele, i, arr) {
      return arr.map(function (ele) {
        return ele[prop];
      }).indexOf(ele[prop]) === i;
    };
  } else {
    return function (ele, i, arr) {
      return arr.indexOf(ele) === i;
    };
  }
};

/***/ })
/******/ ]);