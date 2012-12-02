
/**
 * Module dependencies.
 */

var fs = require('fs')
  , config = fs.readFileSync('./config.json')
  , configObj;


    
try {
  configObj = JSON.parse(config);
} catch (err) {
  console.log(err);
}

var nano = require('nano')(configObj.db.url);
var db = nano.use(configObj.db.schema);

var done = function (msg,res)
{
  console.log(msg);
}

// read all files in the current directory in parallell

var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          console.log(file);
          results.push(file);
          // parse and push
          fs.readFile(file, function (err, data) {
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
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

var pushToCouchDB = function (file) {
  fs.readFile(file, function (err, data) {
    if (err) {
      console.log(err);
      process.exit(1);
    } else {
      data = JSON.parse(data);
      console.log(data);
      var length = data.length;
      for(var i in data) {
        var doc = JSON.parse("{ \"signum\":\"" + data[i].Signums.toLowerCase() + "\",\"sap\":" + JSON.stringify(data[i]) + "}");
        console.log(doc);
        //pushProfileToMainDB(data, doc, i);
      }     
    }
  });
}

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

// this is our main

var file = __dirname + '/data/input/sap.json';

pushToCouchDB(file);

