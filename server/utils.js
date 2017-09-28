'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var asyncMiddleware = exports.asyncMiddleware = function asyncMiddleware(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(function (e) {
      if (e && e.statusCode === 401) {
        cleanSession(service, req);
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
//# sourceMappingURL=utils.js.map