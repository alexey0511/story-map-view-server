/*
* TODO
* Implement project error responses
* manage github limit
* use csrf tokens
*
*/

const express     = require('express');
const router      = express.Router();
const requestPromise = require('request-promise')

const SERVICES = {
  GITHUB: 'https://api.github.com',
  GITLAB_EXTERNAL: 'https://gitlab.catalyst.net.nz',
  REDMINE: 'https://redmine.catalyst.net.nz'
}

router.use((req, res, next) => { // run for any & all requests

  // res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Origin', 'https://alexey0511.github.io');
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  // handle options, because e.g. redmine can't handle it
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

router.route('/login/:service')
  .post((req, res) => {
    switch(req.params.service) {
      case 'gitlab-external':
          requestPromise({
            method: 'POST',
            uri: `${SERVICES.GITLAB_EXTERNAL}/oauth/token`,
            formData: { username: req.body.username, password: req.body.password, grant_type: "password" }
          }).then(data => {
            req.session.gitlab_token = `${JSON.parse(data).access_token}`
            res.sendStatus(200);
          })
          .catch(e => {
            console.log(e.message)
            res.sendStatus(400)
          })
        break;

      case 'redmine':
        let creds = new Buffer(`${req.body.username}:${req.body.password}`).toString('base64')
        req.session.redmine_auth = `Basic ${creds}`
        res.sendStatus(200);
        break;

      case 'Github':
      case 'github':
        let github_creds = new Buffer(`${req.body.username}:${req.body.password}`).toString('base64')
        req.session.github_auth = `Basic ${github_creds}`
        res.sendStatus(200);
        break;
      default:
      res.sendStatus(404);
    }
  });

  router.route('/is-authenticated/:service')
    .get((req, res) => {
    switch(req.params.service){
      case 'gitlab-external':
        if (req.session.gitlab_token) {
          res.json(true)
        } else {
          res.json(false)
        }
        break;
      case 'redmine':
        if (req.session.redmine_auth) {
          res.json(true)
        } else {
          res.json(false)
        }
        break;
      case 'Github':
      case 'github':
      if (req.session.github_auth) {
        res.json(true)
      } else {
        res.json(false)
      }
      break;
      default:
      console.log("SERVICE" , req.params.service)
      res.sendStatus(404)
    }
  })

  router.route('/logout')
    .get((req, res) => {
    req.session.auth = null

    req.session.isLoggedIn = false
    res.sendStatus(200);
  })

  router.route('/projects/:service')
    .get((req, res) => {
      switch(req.params.service) {
        case 'gitlab-external':
          // TODO ensure token is not expired and if it is, refresh

          requestPromise({
            uri: `${SERVICES.GITLAB_EXTERNAL}/api/v4/projects?access_token=${req.session.gitlab_token}`,
            json: true
          }).then((data) => {
            res.setHeader('content-type', 'application/json')
            res.json(data)
          })
          .catch(e => {
            res.status(e.statusCode).send(e.message)
          })
          break;
        case 'redmine':
          requestPromise.get({
            uri: `${SERVICES.REDMINE}/projects.json`,
            headers: {
              'Authorization': req.session.redmine_auth
            },
            json: true
          }).then(data => {
            res.setHeader('content-type', 'application/json')
            res.json(data.projects.map(p => ({
              id: p.id,
              name: p.name
            })))
          })
          .catch(e => {
            handleErrors(e, req.params.service, req,  res)
          })
          break;
        case 'github':
          requestPromise.get({
            uri: `${SERVICES.GITHUB}/user/repos`,
            headers: {
              'Authorization': req.session.github_auth,
              'User-Agent': 'smv'
            },
            json: true
          }).then(data => {
            res.setHeader('content-type', 'application/json')
            res.json(data.map(p => ({
              id: p.full_name,
              name: p.name
            })))
          })
          .catch(e => {
            res.status(e.statusCode).send(e.message)
          })
          break;
        default:
        res.sendStatus(404)
      }
  })

  router.route('/fetch-view-data/:service')
    .get((req, res) => {
      switch (req.params.service) {
        case 'gitlab-external':
          const gitlab_url = 'https://gitlab.catalyst.net.nz'
          console.log(req.session)
          const access_token = req.session.gitlab_token
          const urls = [
            `${gitlab_url}/api/v4/projects/${req.query.project}/issues?access_token=${access_token}`,
            `${gitlab_url}/api/v4/projects/${req.query.project}/labels?access_token=${access_token}`,
            `${gitlab_url}/api/v4/projects/${req.query.project}/milestones?access_token=${access_token}`
          ]

          const promises = urls.map(url => requestPromise({
            uri: url,
            json: true
          }));

          Promise.all(promises).then(data => {
            res.setHeader('content-type', 'application/json')
            res.json({
              issues: data[0].map(i => ({
                      title: i.title,
                      milestone: i.milestone.title,
                      labels: i.labels,
                      user: i.author.name,
                      id: i.id
                    })),
              steps: data[1].reverse(),
              releases: data[2].reverse()
            })
          })
          .catch(e => {
            res.status(e.statusCode).send(e.message)
          })
          break;
        case 'redmine':
          const url = "https://redmine.catalyst.net.nz"
          console.log(req.session.redmine_auth)
          requestPromise({
            uri: `${url}/issues.json?project_id=${req.query.project}&include=relations`,
            headers: {
              'Authorization': req.session.redmine_auth
            },
            json: true
          })
          .then(data => {
              let issues = data.issues
              let steps = issues.filter(i => !!i.category).map(i => ({name: i.category.name, id: i.category.id}))

              let uniquesteps = Object.values(steps.reduce((hash, obj) => {
                let isExist = Object.values(hash).some(v => v.id === obj.id)
                return !isExist ? Object.assign(hash, {[obj.id] : obj}) : hash
              }, Object.create(null)))

              let releases = issues
                .filter(m => !!m.release && !!m.release.release)
                .map((i, id) => ({title: i.release.release.name, id: i.release.release.id, number: -1 * id}))

              let uniquereleases = Object.values(releases.reduce((hash, obj) => {
                let isExist = Object.values(hash).some(v => v.id === obj.id)
                return !isExist ? Object.assign(hash, {[obj.id] : obj}) : hash
              }, Object.create(null)))

              if (!steps.length || !releases.length) {
                alert("Selected Project doesn't have any steps or releases")
                return false
              }
              res.json({
                steps: uniquesteps.reverse(),
                releases: uniquereleases,
                issues: issues.map(i => ({
                  title: i.subject,
                  milestone: !!i.release && !!i.release.release ? i.release.release.name : null,
                  labels: [i.category ? i.category.name:null],
                  user: i.author.name,
                  id: i.id
                }))
              })
            })
            .catch(e => {
              res.status(e.statusCode).send(e.message)
            })
          break;
        case 'github':
        let github_urls = [
          `${SERVICES.GITHUB}/repos/${req.query.project}/issues`,
          `${SERVICES.GITHUB}/repos/${req.query.project}/labels`,
          `${SERVICES.GITHUB}/repos/${req.query.project}/milestones`
        ]
        let github_promises = github_urls.map(url => requestPromise({
          uri: url,
          headers: {
            'Authorization': req.session.github_auth,
            'User-Agent': 'smv'
          },
          json: true
        }));

        Promise.all(github_promises).then(data => {
              res.json({
                steps: data[1].reverse(),
                releases: data[2].reverse(),
                issues: data[0].map(i => {
                  return {
                    title: i.title,
                    milestone: i.milestone.title,
                    labels: i.labels.map(l=> l.name),
                    user: i.user.login,
                    id: i.id
                  }
                }).reverse()
              })
            })
            .catch(e => {
              res.status(e.statusCode).send(e.message)
            })
            break;
        default:
          res.sendStatus(404)
      }
  })

  const handleErrors = (e, service, req, res) => {
    if (e.statusCode === 401) {
      cleanSession(service, req)
    }
    res.status(e.statusCode).send(e)
  }

  const cleanSession = (service, req) => {
          if (service === 'redmine') {
            req.session.redmine_auth = null
          }

          if (service === 'gitlab-external') {
            req.session.gitlab_token = null
          }

          if (service === 'github') {
            req.session.github_auth = null
          }
        }


module.exports = router;
