!function(e){function t(n){if(r[n])return r[n].exports;var s=r[n]={i:n,l:!1,exports:{}};return e[n].call(s.exports,s,s.exports,t),s.l=!0,s.exports}var r={};t.m=e,t.c=r,t.d=function(e,r,n){t.o(e,r)||Object.defineProperty(e,r,{configurable:!1,enumerable:!0,get:n})},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=2)}([function(e,t){e.exports=require("express")},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=(t.asyncMiddleware=function(e){return function(t,r,s){Promise.resolve(e(t,r,s)).catch(function(e){e&&401===e.statusCode&&n(t),s()})}},t.cleanSession=function(e){e.path.includes("redmine")&&(e.session.redmine_auth=null),e.path.includes("gitlab-external")&&(e.session.gitlab_token=null),e.path.includes("github")&&(e.session.github_auth=null)});t.uniqFilterAccordingToProp=function(e){return e?function(t,r,n){return n.map(function(t){return t[e]}).indexOf(t[e])===r}:function(e,t,r){return r.indexOf(e)===t}},t.genuuid=function(){function e(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1)}return e()+e()+"-"+e()+"-"+e()+"-"+e()+"-"+e()+e()+e()}},function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}var s=r(0),i=n(s),a=r(3),o=n(a),u=r(4),c=n(u),l=r(5),p=n(l),d=r(6),f=n(d),m=r(1),g=(0,i.default)();g.use(c.default.json()),g.use((0,o.default)({genid:function(){return(0,m.genuuid)()},resave:!0,saveUninitialized:!0,secret:"the secret",cookie:{secure:!1}})),g.set("trust proxy",1),g.use(i.default.static(p.default.join(__dirname,"./client"))),g.use("/api",f.default),g.listen(process.env.PORT||8081)},function(e,t){e.exports=require("express-session")},function(e,t){e.exports=require("body-parser")},function(e,t){e.exports=require("path")},function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function s(e){return function(){var t=e.apply(this,arguments);return new Promise(function(e,r){function n(s,i){try{var a=t[s](i),o=a.value}catch(e){return void r(e)}if(!a.done)return Promise.resolve(o).then(function(e){n("next",e)},function(e){n("throw",e)});e(o)}return n("next")})}}Object.defineProperty(t,"__esModule",{value:!0}),r(7);var i=r(0),a=n(i),o=r(8),u=n(o),c=r(1),l={GITHUB:"https://api.github.com",GITLAB_EXTERNAL:"https://gitlab.catalyst.net.nz",REDMINE:"https://redmine.catalyst.net.nz"},p=a.default.Router();p.route("/login/github").post((0,c.asyncMiddleware)(function(){var e=s(regeneratorRuntime.mark(function e(t,r,n){var s;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:s=new Buffer(t.body.username+":"+t.body.password).toString("base64"),t.session.github_auth="Basic "+s,r.send(!0);case 3:case"end":return e.stop()}},e,void 0)}));return function(t,r,n){return e.apply(this,arguments)}}())),p.route("/login/gitlab-external").post((0,c.asyncMiddleware)(function(){var e=s(regeneratorRuntime.mark(function e(t,r,n){var s;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,u.default)({method:"POST",uri:l.GITLAB_EXTERNAL+"/oauth/token",formData:{username:t.body.username,password:t.body.password,grant_type:"password"}});case 2:s=e.sent,t.session.gitlab_token=""+JSON.parse(s).access_token,r.send(!0);case 5:case"end":return e.stop()}},e,void 0)}));return function(t,r,n){return e.apply(this,arguments)}}())),p.route("/login/redmine").post((0,c.asyncMiddleware)(function(){var e=s(regeneratorRuntime.mark(function e(t,r,n){var s;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:s=new Buffer(t.body.username+":"+t.body.password).toString("base64"),t.session.redmine_auth="Basic "+s,r.send(!0);case 3:case"end":return e.stop()}},e,void 0)}));return function(t,r,n){return e.apply(this,arguments)}}())),p.route("/is-authenticated/:service").get((0,c.asyncMiddleware)(function(){var e=s(regeneratorRuntime.mark(function e(t,r,n){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:e.t0=t.params.service,e.next="gitlab-external"===e.t0?3:"redmine"===e.t0?5:"github"===e.t0?7:9;break;case 3:return t.session.gitlab_token?r.json(!0):r.json(!1),e.abrupt("break",11);case 5:return t.session.redmine_auth?r.json(!0):r.json(!1),e.abrupt("break",11);case 7:return t.session.github_auth?r.json(!0):r.json(!1),e.abrupt("break",11);case 9:console.log("SERVICE",t.params.service),r.sendStatus(404);case 11:case"end":return e.stop()}},e,void 0)}));return function(t,r,n){return e.apply(this,arguments)}}())),p.route("/logout/github").get((0,c.asyncMiddleware)(function(){var e=s(regeneratorRuntime.mark(function e(t,r,n){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:t.session.github_auth=null,r.send(!0);case 2:case"end":return e.stop()}},e,void 0)}));return function(t,r,n){return e.apply(this,arguments)}}())),p.route("/logout/gitlab-external").get((0,c.asyncMiddleware)(function(){var e=s(regeneratorRuntime.mark(function e(t,r,n){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:t.session.gitlab_token=null,r.send(!0);case 2:case"end":return e.stop()}},e,void 0)}));return function(t,r,n){return e.apply(this,arguments)}}())),p.route("/logout/redmine").get((0,c.asyncMiddleware)(function(){var e=s(regeneratorRuntime.mark(function e(t,r,n){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:t.session.redmine_auth=null,r.send(!0);case 2:case"end":return e.stop()}},e,void 0)}));return function(t,r,n){return e.apply(this,arguments)}}())),p.route("/projects/github").get((0,c.asyncMiddleware)(function(){var e=s(regeneratorRuntime.mark(function e(t,r,n){var s;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,u.default)({uri:l.GITHUB+"/user/repos",headers:{Authorization:t.session.github_auth,"User-Agent":"smv"},json:!0});case 2:s=e.sent,r.setHeader("content-type","application/json"),r.json(s.map(function(e){return{id:e.full_name,name:e.name}}));case 5:case"end":return e.stop()}},e,void 0)}));return function(t,r,n){return e.apply(this,arguments)}}())),p.route("/projects/gitlab-external").get((0,c.asyncMiddleware)(function(){var e=s(regeneratorRuntime.mark(function e(t,r,n){var s;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,u.default)({uri:l.GITLAB_EXTERNAL+"/api/v4/projects?access_token="+t.session.gitlab_token,json:!0});case 2:s=e.sent,r.setHeader("content-type","application/json"),r.json(s);case 5:case"end":return e.stop()}},e,void 0)}));return function(t,r,n){return e.apply(this,arguments)}}())),p.route("/projects/redmine").get((0,c.asyncMiddleware)(function(){var e=s(regeneratorRuntime.mark(function e(t,r,n){var s;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,u.default)({uri:l.REDMINE+"/projects.json",headers:{Authorization:t.session.redmine_auth},json:!0});case 2:s=e.sent,r.setHeader("content-type","application/json"),r.json(s.projects.map(function(e){return{id:e.id,name:e.name}}));case 5:case"end":return e.stop()}},e,void 0)}));return function(t,r,n){return e.apply(this,arguments)}}())),p.route("/fetch-view-data/github").get((0,c.asyncMiddleware)(function(){var e=s(regeneratorRuntime.mark(function e(t,r,n){var s,i,a;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return s=[l.GITHUB+"/repos/"+t.query.project+"/issues",l.GITHUB+"/repos/"+t.query.project+"/labels",l.GITHUB+"/repos/"+t.query.project+"/milestones"],i=s.map(function(e){return(0,u.default)({uri:e,headers:{Authorization:t.session.github_auth,"User-Agent":"smv"},json:!0})}),e.next=4,Promise.all(i);case 4:a=e.sent,r.json({steps:a[1].reverse(),releases:a[2].reverse(),issues:a[0].map(function(e){return{title:e.title,milestone:e.milestone.title,labels:e.labels.map(function(e){return e.name}),user:e.user.login,id:e.id}}).reverse()});case 6:case"end":return e.stop()}},e,void 0)}));return function(t,r,n){return e.apply(this,arguments)}}())),p.route("/fetch-view-data/gitlab-external").get((0,c.asyncMiddleware)(function(){var e=s(regeneratorRuntime.mark(function e(t,r,n){var s,i,a,o;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return s=t.session.gitlab_token,i=[l.GITLAB_EXTERNAL+"/api/v4/projects/"+t.query.project+"/issues?access_token="+s,l.GITLAB_EXTERNAL+"/api/v4/projects/"+t.query.project+"/labels?access_token="+s,l.GITLAB_EXTERNAL+"/api/v4/projects/"+t.query.project+"/milestones?access_token="+s],a=i.map(function(e){return(0,u.default)({uri:e,json:!0})}),e.next=5,Promise.all(a);case 5:o=e.sent,r.setHeader("content-type","application/json"),r.json({issues:o[0].map(function(e){return{title:e.title,milestone:e.milestone.title,labels:e.labels,user:e.author.name,id:e.id}}),steps:o[1].reverse(),releases:o[2].reverse()});case 8:case"end":return e.stop()}},e,void 0)}));return function(t,r,n){return e.apply(this,arguments)}}())),p.route("/fetch-view-data/redmine").get((0,c.asyncMiddleware)(function(){var e=s(regeneratorRuntime.mark(function e(t,r,n){var s,i,a,o,p,d,f;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return s={uri:l.REDMINE+"/issues.json?project_id="+t.query.project+"&include=relations",headers:{Authorization:t.session.redmine_auth},json:!0},e.next=3,(0,u.default)(s);case 3:i=e.sent,a=i.issues,o=a.filter(function(e){return!!e.category}).map(function(e){return{name:e.category.name,id:e.category.id}}),p=o.filter((0,c.uniqFilterAccordingToProp)("id")),d=a.filter(function(e){return!!e.release&&!!e.release.release}).map(function(e,t){return{title:e.release.release.name,id:e.release.release.id,number:-1*t}}),f=d.filter((0,c.uniqFilterAccordingToProp)("id")),r.json({steps:p,releases:f,issues:a.map(function(e){return{title:e.subject,milestone:e.release&&e.release.release?e.release.release.name:null,labels:[e.category?e.category.name:null],user:e.author.name,id:e.id}})});case 10:case"end":return e.stop()}},e,void 0)}));return function(t,r,n){return e.apply(this,arguments)}}()));t.default=p},function(e,t){e.exports=require("babel-polyfill")},function(e,t){e.exports=require("request-promise")}]);