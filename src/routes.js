/*
* TODO
* Implement project error responses
* manage github limit
* use csrf tokens
*
*/

// Required in order to use 'import'
import 'babel-polyfill'

import express from  'express'
import requestPromise from 'request-promise'
import { asyncMiddleware, uniqFilterAccordingToProp } from './utils'

const SERVICES = {
  GITHUB: 'https://api.github.com',
  GITLAB_EXTERNAL: 'https://gitlab.catalyst.net.nz',
  REDMINE: 'https://redmine.catalyst.net.nz'
}

const router = express.Router()

router.use(asyncMiddleware(async (req, res, next) => { // run for any & all requests
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
}));
router.route('/login/github')
  .post(asyncMiddleware(async (req, res, next) => {
    //TODO: call redmine for auth
    let github_creds = new Buffer(`${req.body.username}:${req.body.password}`).toString('base64')
    req.session.github_auth = `Basic ${github_creds}`
    res.sendStatus(200);
}))

router.route('/login/gitlab-external')
  .post(asyncMiddleware(async (req, res, next) => {
    const data = await requestPromise({
                method: 'POST',
                uri: `${SERVICES.GITLAB_EXTERNAL}/oauth/token`,
                formData: { username: req.body.username, password: req.body.password, grant_type: "password" }
              })
    req.session.gitlab_token = `${JSON.parse(data).access_token}`
    res.sendStatus(200);

}))

router.route('/login/redmine')
  .post(asyncMiddleware(async (req, res, next) => {
    //TODO: call redmine for auth
    let creds = new Buffer(`${req.body.username}:${req.body.password}`).toString('base64')
    req.session.redmine_auth = `Basic ${creds}`
    res.sendStatus(200);

}))

  router.route('/is-authenticated/:service')
    .get(asyncMiddleware(async (req, res, next) => {
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
  }))

  router.route('/logout')
    .get((req, res) => {
    req.session.auth = null

    req.session.isLoggedIn = false
    res.sendStatus(200);
  })

router.route('/projects/github')
  .get(asyncMiddleware(async (req, res, next) => {
    const data = await requestPromise({
      uri: `${SERVICES.GITHUB}/user/repos`,
      headers: {
        'Authorization': req.session.github_auth,
        'User-Agent': 'smv'
      },
      json: true
    })

    res.setHeader('content-type', 'application/json')
    res.json(data.map(p => ({ id: p.full_name, name: p.name }) ))
}))

router.route('/projects/gitlab-external')
  .get(asyncMiddleware(async (req, res, next) => {
    // TODO ensure token is not expired and if it is, refresh

    const data = await requestPromise({
      uri: `${SERVICES.GITLAB_EXTERNAL}/api/v4/projects?access_token=${req.session.gitlab_token}`,
      json: true
    })

      res.setHeader('content-type', 'application/json')
      res.json(data)
}))

router.route('/projects/redmine')
  .get(asyncMiddleware(async (req, res, next) => {
    const data = await requestPromise({
      uri: `${SERVICES.REDMINE}/projects.json`,
      headers: {
        'Authorization': req.session.redmine_auth
      },
      json: true
    })

    res.setHeader('content-type', 'application/json')
    res.json(data.projects.map(p => ({
      id: p.id,
      name: p.name
    })))
}))

router.route('/fetch-view-data/github')
  .get(asyncMiddleware(async (req, res, next) => {
    let github_urls = [
      `${SERVICES.GITHUB}/repos/${req.query.project}/issues`,
      `${SERVICES.GITHUB}/repos/${req.query.project}/labels`,
      `${SERVICES.GITHUB}/repos/${req.query.project}/milestones`
    ]
    const github_promises = github_urls.map(url => requestPromise({
      uri: url,
      headers: {
        'Authorization': req.session.github_auth,
        'User-Agent': 'smv'
      },
      json: true
    }));

    const data = await Promise.all(github_promises)

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
  }))

router.route('/fetch-view-data/gitlab-external')
  .get(asyncMiddleware(async (req, res, next) => {
    const access_token = req.session.gitlab_token
    const urls = [
      `${SERVICES.GITLAB_EXTERNAL}/api/v4/projects/${req.query.project}/issues?access_token=${access_token}`,
      `${SERVICES.GITLAB_EXTERNAL}/api/v4/projects/${req.query.project}/labels?access_token=${access_token}`,
      `${SERVICES.GITLAB_EXTERNAL}/api/v4/projects/${req.query.project}/milestones?access_token=${access_token}`
    ]

    const promises = urls.map(url => requestPromise({
      uri: url,
      json: true
    }));

    let data = await promises
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
  }))

router.route('/fetch-view-data/redmine')
  .get(asyncMiddleware(async (req, res, next) => {
    const options = {
      uri: `${SERVICES.REDMINE}/issues.json?project_id=${req.query.project}&include=relations`,
      headers: {
        'Authorization': req.session.redmine_auth
      },
      json: true
    }
    const data = await requestPromise(options)

    const issues = data.issues
    const steps = issues.filter(i => !!i.category).map(i => ({name: i.category.name, id: i.category.id}))

    const uniquesteps = steps.filter(uniqFilterAccordingToProp('id'))

    const releases = issues
      .filter(m => !!m.release && !!m.release.release)
      .map((i, id) => ({title: i.release.release.name, id: i.release.release.id, number: -1 * id}))

    const uniquereleases = releases.filter(uniqFilterAccordingToProp('id'))

    res.json({
      steps: uniquesteps,
      releases: uniquereleases,
      issues: issues.map(i => ({
        title: i.subject,
        milestone: !!i.release && !!i.release.release ? i.release.release.name : null,
        labels: [i.category ? i.category.name:null],
        user: i.author.name,
        id: i.id
      }))
    })
  }))


  const handleErrors = (e, service, req, res) => {
    res.status(e.statusCode).send(e)
  }



export default router
