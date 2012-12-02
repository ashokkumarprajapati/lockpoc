
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , fs = require('fs')
  , npm = require('npm')
  , linkedin_connector = require('./linkedin_connector.js')
  , hbs = require('hbs');

var defaults = {
    "linkedin" : {
    "appKey" : "6z0z3jb0dzw6",
        "appSecret" : "Wj8EjGQqviDhFxqR",
        "callbackUrl" : "http://localhost:8020/auth"
    },
    "npm" : {
        "username" : "amit",
        "password" : "amit",
        "email" : "amit_archie@yahoo.co.in"
    },
    "ldap" : {
        "host" : "169.144.104.100",
        "port" : "8080",
        "path" : "/SXS-Automation-Core-APIs/coreServices/ldap/auth",
        "method" : "POST"
    },
    "db" : {
        "url" : "http://narendra:narendra@localhost:5984/",
        "user" : "narendra",
        "password" : "narendra",
        "schema" : "profiles",
        "_design" : "_design/app/"        
    },    
    "imagedb" : {
        "url" : "http://narendra:narendra@localhost:5984/",
        "schema" : "profileimagedb",
        "_design_view" : "_design/image/_view/getDocid"
    }   
};

var config = defaults;

try {
    config = JSON.parse(fs.readFileSync('./config.json'));
} catch (err) {
    console.log(err); // use defaults
}
  
var nano = require('nano')(config.db.url);
var db = nano.use(config.db.schema);

var nano = require('nano')(config.imagedb.url);
var imagedb = nano.use(config.imagedb.schema);

var picurl = '';

var linkedin_client = 
require('linkedin-js')(config.linkedin.appKey, config.linkedin.appSecret,config.linkedin.callbackUrl);  
 
var app = express();

////////////////////////////////////////////////
// Express Configuration
////////////////////////////////////////////////
app.configure(function(){
  app.set('port', process.env.PORT || 8021);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.engine('html', hbs.__express);
 // app.set("view options", { layout: false }) ;
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

////////////////////////////////////////////////
// Handlebars
////////////////////////////////////////////////

var blocks = {};

hbs.registerHelper('extend', function(name, context) {
    var block = blocks[name];
    if (!block) {
        block = blocks[name] = [];
    }
    block.push(context(this));
});

hbs.registerHelper('block', function(name) {
    var val = (blocks[name] || []).join('\n');
    // clear the block
    blocks[name] = [];
    return val;
});

////////////////////////////////////////////////
// Router
////////////////////////////////////////////////

app.get('/', function(req, res) {
  if (req && req.session && req.session.user)
    res.render('profile', { title: 'LockBox' });
  else
    res.render('about', { title: 'LockBox' });
});

app.get('/login', function(req, res) {
  res.render('login', { title: 'LockBox' });
});

app.post('/login',function(req,res){

    if (req.body.username) {
      req.session.user = req.body.username;
    }
    // Love all - Serve all!
    
    auth = JSON.stringify({
    "username" : req.body.username,
    "password" : req.body.password
    });
        
    var options = {
      host: config.ldap.host,
      port: config.ldap.port,
      path: config.ldap.path,
      method: config.ldap.method,
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      }
    };

    var post_req = http.request(options, function(resp) {
      resp.on('data', function (chunk) {
          authenticate = JSON.parse(chunk);
          if(authenticate.authDone) {
            req.session.user = req.body.username;    
            res.render('connect',{username :req.session.user});
          }
          else {
            res.render('login', { error:'Username or Password is incorrect' });
          }
       });
    });
   // post the data
   post_req.write(jsonObject);
   post_req.end();
   

});

app.get('/connect', function(req, res) {
  res.render('connect', { title: 'LockBox' });
});

app.get('/profile', function(req, res) {
  res.render('profile', { title: 'LockBox' });
});

app.get('/settings', function(req, res) {
  res.render('settings', { title: 'LockBox' });
});

app.get('/about', function(req, res) {
  res.render('about', { title: 'LockBox' });
});

app.get('/contact', function(req, res) {
  res.render('contact', { title: 'LockBox' });
});

////////////////////////////////////////////////
// HTTP Server
////////////////////////////////////////////////
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
