
/**
 * Module dependencies.
 */

var path = require('path')
  , fs = require('fs')
  , express = require('express')
  , http = require('http')
  , sys = require('sys')
  , exec = require('child_process').exec
  , config = fs.readFileSync('./config.json')
  , configObj;
    
try {
  configObj = JSON.parse(config);
} catch (err) {
  console.log(err);
}

var nano = require('nano')(configObj.db.url);
var db = nano.use(configObj.db.schema);

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 8030);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('hemliga klubben'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
  parseCSV();
});

var parseCSV = function(req, res) {
		console.log("Parsing SAP CSV data started ...");
		exec('python ./util/csv2json.py ./sap-dummy/sap-data.csv', 
  			function (error, stdout, stderr) {
    		console.log(stdout);
    		console.log(stderr);
    		if (error !== null) {
      			throw 'Error in parsing CSV: = ' + error;
      			process.exit(1);
    		} else {
    			console.log("Parsing SAP CSV data completed...");
    			pushProfiles(req, res);
    		}
		});
};

var pushProfiles = function (req, res) {	
	console.log("Pushing profiles ...");	
	var location = __dirname + '/sap-dummy/sap-data.json';
	
	fs.readFile(location, function (err, data) {
  		if (err) {
  			console.log(err);
  			process.exit(1);
  		} else {
  			data = JSON.parse(data);
  			var length = data.length;
  			for(var i in data) {
  				var doc = JSON.parse("{ \"signum\":\"" + data[i].Signums.toLowerCase() + "\",\"sap\":" + JSON.stringify(data[i]) + "}");
				pushProfileToMainDB(data, doc, i);
  			}			
  		}
	});
};

var pushProfileToMainDB = function(data, doc, i) {
	var params = { keys: [ '' + data[i].Signums.toLowerCase() + '' ] };
  	db.view('app', 'getProfile', params , function(err, body) {
  	if (err) {
    	console.log(err);
  	} else {
  		if(body.rows.length > 0){
  			console.log("User " + data[i].Signums.toLowerCase() + " is already available in DB. Updating SAP data.");
  			doc = body.rows[0].value;
  			doc.sap = data[i];
  			db.insert(doc, function(err, body) {
  				if (err) {    				
    				console.log(err);
    			} else {
    				pushProfileToDisk(data, doc, i, body);
    			}    				
			});
  		} else {
  			console.log("User " + data[i].Signums.toLowerCase() + " not available in DB.");
  			db.insert(doc, function(err, body) {
  				if (err) {    				
    				console.log(err);
    			} else {
    				pushProfileToDisk(data, doc, i, body);
    			}    				
			});
  		}
  	}
	});
};

var pushProfileToDisk = function(data, doc, i, body) {
	// User's directory is not created in system.
	doc._id = body.id;
	doc._rev = body.rev;
	if(!fs.existsSync(__dirname + '/../publish/profiles/' + data[i].Signums.toLowerCase())) {
		console.log(data[i].Signums.toLowerCase() + " directory is not available");
		fs.mkdirSync(__dirname + '/../publish/profiles/' + data[i].Signums.toLowerCase());
		fs.writeFileSync(__dirname + '/../publish/profiles/' + data[i].Signums.toLowerCase() + '/profile.json',JSON.stringify(doc));
    } else {
    	//Updating user's profile.json.
    	console.log(data[i].Signums.toLowerCase() + " updating profile.json");
    	fs.writeFileSync(__dirname + '/../publish/profiles/' + data[i].Signums.toLowerCase() + '/profile.json',JSON.stringify(doc));
    	}	   	
};