/**
 * Module dependencies.
 */

var express = require('express')
  , path = require('path')
  , http = require('http')
  , hbs = require('hbs')
  
var app = express();

////////////////////////////////////////////////
// Express Configuration
////////////////////////////////////////////////
app.configure(function(){
  app.set('port', process.env.PORT || 8032);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.engine('html', hbs.__express);
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
    //console.log(name);
    //console.log(context);
    //if (this && context)
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
  console.log(req);
  res.render('index', { title: 'Search' });
});

app.get('#about', function(req, res) {
  res.render('about', { title: 'Search' });
});

app.get('#search', function(req, res) {
  res.render('search', { title: 'Search' });
});

app.get('#contact', function(req, res) {
  res.render('contact', { title: 'Search' });
});

app.get('#splash', function(req, res) {
  res.render('splash', { title: 'Search' });
});

////////////////////////////////////////////////
// HTTP Server
////////////////////////////////////////////////

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
  console.log(app.routes);
});
