const express = require('express');
const request = require('request');

var app = express();
app.use('/', function(req, res) {
  let apiServerHost;
  const service = req.url.split('/')[1] // passing service name as in a route

  switch(service) {
    case 'github':
      apiServerHost = 'https://api.github.com'
      break;
    case 'gitlab':
      apiServerHost = 'https://gitlab.catalyst.net.nz'
      break;
    case 'redmine':
      apiServerHost = 'https://redmine.catalyst.net.nz'
      break;
    default:
      res.send(404)
  }

  const url = req.url.replace('/' + service, apiServerHost)

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  // handle options, because e.g. redmine can't handle it
  if (req.method === 'OPTIONS') {
    res.send(200);
  } else {
    req.pipe(request(url)).pipe(res);
  }
});

app.listen(process.env.PORT || 3000);
