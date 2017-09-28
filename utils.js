export const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next))
    .catch(e => {
      if (e && e.statusCode === 401) {
        cleanSession(service, req)
      }
      next()
    })
}

export const cleanSession = (req) => {
  if (req.path.includes('redmine')) {
    req.session.redmine_auth = null
  }

  if (req.path.includes('gitlab-external')) {
    req.session.gitlab_token = null
  }

  if (req.path.includes('github')) {
    req.session.github_auth = null
  }
}

export const uniqFilterAccordingToProp = function (prop) {
  if (prop) {
      return (ele, i, arr) => arr.map(ele => ele[prop]).indexOf(ele[prop]) === i
  } else {
      return (ele, i, arr) => arr.indexOf(ele) === i
  }
}
