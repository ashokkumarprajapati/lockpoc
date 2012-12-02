
var http = require('http')
  , path = require('path')
  , fs = require('fs')
  , $ = require('jquery');

var config = fs.readFileSync('./config.json'); 
  
try {
  config = JSON.parse(config);
} catch (err) {
  console.log(err);
}

var linkedin_client = require('linkedin-js')(config.linkedin.appKey, config.linkedin.appSecret,config.linkedin.callbackUrl);

// above piece of codes are best candidates for putting in some common.js and get extended by other js in module.

exports.pullProfile = function (req, res) {
	var userName = req.session.user;
  	if(!fs.existsSync(__dirname + '/profiles/')) {
  		fs.mkdirSync(__dirname + '/profiles');
  	}

	linkedin_client.apiCall('GET', 
  	'/people/~:(id,first-name,last-name,headline,group-memberships,location:(name,country:(code)),industry,current-share,connections,num-connections,summary,specialties,proposal-comments,associations,honors,interests,positions,publications,patents,languages,skills,certifications,educations,num-recommenders,recommendations-received,phone-numbers,im-accounts,twitter-accounts,date-of-birth,main-address,member-url-resources,picture-url,site-standard-profile-request:(url),api-standard-profile-request:(url),site-public-profile-request:(url),api-public-profile-request:(url),public-profile-url)',
  	{token:req.session.token},
  	function (error, result, response) {
    	if (!error)
      	{
       		if(!fs.existsSync(__dirname + '/profiles/' + userName +'/linkedin')) {
       			fs.mkdirSync(__dirname + '/profiles/' + userName +'/linkedin');
       		}
       		fs.writeFileSync(__dirname + '/profiles/' + userName + '/linkedin/package.json',JSON.stringify(result));
			try {
				mergeProfile(userName, result);
			} catch (err) {
				console.log("Exception in pulling Linkedin data" + err);
			}
		  	res.render('thanks',{avatar:result.pictureUrl.value});			
      	} else {
        	console.log(error);
      	}
      });   
}

var mergeProfile = function (userName, result) {
	if(!fs.existsSync(__dirname + '/profiles/' + userName +'/profile.json')) {
		throw "Default SAP profile is not available.";
    } else {
		var profile = fs.readFileSync(__dirname + '/profiles/' + userName +'/profile.json');
		profile = JSON.parse(profile);
		if(!profile.linkedin) {
			console.log("Linkedin profile doesn't exist");
			defaultProfileMasking(result);
			profile.linkedin = result;
		} else {
			console.log("Linkedin profile exist");
			mergeLinkedinProfile(result, profile);
		}
		
		fs.writeFileSync(__dirname + '/profiles/' + userName + '/profile.json',JSON.stringify(profile));
    }
};

var mergeLinkedinProfile = function (result, profile) {
	
	if(result.connections && result.connections.values) {
		if(profile.linkedin.connections.values) {
			delete profile.linkedin.connections.values;
		}
		profile.linkedin.connections._total = result.connections._total;
		profile.linkedin.connections.values = result.connections.values;
	} 	
	if(result.firstName) {
		profile.linkedin.firstName.value = result.firstName;	
	}
	if(result.headline) {
		profile.linkedin.headline.value = result.headline;	
	}
	if(result.industry) {
		profile.linkedin.industry.value = result.industry;
	}
	if(result.interests) {
		profile.linkedin.interests.value = result.interests;
	}
	if(result.lastName) {
		profile.linkedin.lastName.value = result.lastName;		
	}
	if(result.pictureUrl) {
		profile.linkedin.pictureUrl.value = result.pictureUrl;	
	}
	if(result.publicProfileUrl) {
		profile.linkedin.publicProfileUrl.value = result.publicProfileUrl;	
	}
	if(result.specialties) {
		profile.linkedin.specialties.value = result.specialties;
	}
	if(result.summary) {
		profile.linkedin.summary.value = result.summary;	
	}
	
	if(result.currentShare) {
		var obj1 = profile.linkedin.currentShare;
		var obj2 = result.currentShare;	
		$.extend(true, obj1, obj2);
	}
	
	if(result.location) {	
		obj1 = profile.linkedin.location;
		obj2 = result.location;	
		$.extend(true, obj1, obj2);	
	}
	
	if(result.skills && result.skills.values) {
			for(var i in result.skills.values) {
				obj1 = result.skills.values[i];	
				var matched = false;
				if(profile.linkedin.skills.values) {
					for(var k in profile.linkedin.skills.values) {
						if(profile.linkedin.skills.values[k].id === obj1.id) {
						obj2 = profile.linkedin.skills.values[k];
						$.extend(true, obj2, obj1);
						result.skills.values[i] = obj2;
						matched = true;
						break;
						}
					}
				}
				if(!matched) {
					result.skills.values[i].publish = false;
				}			 
			}
			if(profile.linkedin.skills) {
				delete profile.linkedin.skills;
			}
			profile.linkedin.skills = result.skills;
	}
	
	if(result.recommendationsReceived && result.recommendationsReceived.values) {
		for(var i in result.recommendationsReceived.values) {
				obj1 = result.recommendationsReceived.values[i];	
				var matched = false;
				if(profile.linkedin.recommendationsReceived.values) {
					for(var k in profile.linkedin.recommendationsReceived.values) {
						if(profile.linkedin.recommendationsReceived.values[k].id === obj1.id) {
							obj2 = profile.linkedin.recommendationsReceived.values[k];
							$.extend(true, obj2, obj1);
							result.recommendationsReceived.values[i] = obj2;
							matched = true;
							break;
						}
					}
				}
				if(!matched) {
					result.recommendationsReceived.values[i].publish = false;
				} 
		}
		if(profile.linkedin.recommendationsReceived) {
			delete profile.linkedin.recommendationsReceived;
		}
		profile.linkedin.recommendationsReceived = result.recommendationsReceived;	
	}
	
	if(result.positions && result.positions.values) {
		for(var i in result.positions.values) {
				obj1 = result.positions.values[i];	
				var matched = false;
				if(profile.linkedin.positions.values) {
					for(var k in profile.linkedin.positions.values) {
						if(profile.linkedin.positions.values[k].id === obj1.id) {
							obj2 = profile.linkedin.positions.values[k];
							$.extend(true, obj2, obj1);
							result.positions.values[i] = obj2;
							matched = true;
							break;
						}
					}
				}
				if(!matched) {
					result.positions.values[i].publish = false;
				}	 
		}
		if(profile.linkedin.positions) {
			delete profile.linkedin.positions;
		}
		profile.linkedin.positions = result.positions;
	}
	
	if(result.educations && result.educations.values) {
		for(var i in result.educations.values) {
				obj1 = result.educations.values[i];	
				var matched = false;
				if(profile.linkedin.educations.values) {
					for(var k in profile.linkedin.educations.values) {
						if(profile.linkedin.educations.values[k].id === obj1.id) {
							obj2 = profile.linkedin.educations.values[k];
							$.extend(true, obj2, obj1);
							result.educations.values[i] = obj2;
							matched = true;
							break;
						}
					}
				}
				if(!matched) {
					result.educations.values[i].publish = false;
				} 
		}
		if(profile.linkedin.educations) {
			delete profile.linkedin.educations;
		}
		profile.linkedin.educations = result.educations;
	}		
};

var defaultProfileMasking = function(result) {
	if(result.apiStandardProfileRequest) {
		delete result.apiStandardProfileRequest;
	}
	if(result.id) {
		delete result.id;
	}
	if(result.memberUrlResources) {
		delete result.memberUrlResources;
	}
	if(result.numConnections) {
		delete result.numConnections;
	}
	if(result.numRecommenders) {
		delete result.numRecommenders;
	}
	if(result.siteStandardProfileRequest) {
		delete result.siteStandardProfileRequest;
	}
	if(result.connections) {
		result.connections.publish = false;
	}
	if(result.currentShare) {
		result.currentShare.publish = false;
	}
	if(result.location) {
		result.location.publish = false;
	}
	if(result.educations && result.educations.values) {
		for (var i in result.educations.values) {	
			result.educations.values[i].publish = false;
		}
	}
	if(result.positions && result.positions.values) {
		for (var i in result.positions.values) {	
			result.positions.values[i].publish = false;
		}
	}
	if(result.recommendationsReceived && result.recommendationsReceived.values) {
		for (var i in result.recommendationsReceived.values) {	
			result.recommendationsReceived.values[i].publish = false;
		}
	}
	if(result.skills && result.skills.values) {
		for (var i in result.skills.values) {	
			result.skills.values[i].publish = false;
		}
	}	
	var newJSON;
	var data;
	
	if(result.firstName) {
		data = result.firstName;
		newJSON = { value : data, publish : false };
		result.firstName = JSON.parse(JSON.stringify(newJSON));
	}
	
	if(result.lastName) {
		data = result.lastName;
		newJSON = { value : data, publish : false };
		result.lastName = JSON.parse(JSON.stringify(newJSON));	
	}
	
	if(result.headline) {	
		data = result.headline;
		newJSON = { value : data, publish : false };
		result.headline = JSON.parse(JSON.stringify(newJSON));
	}
	
	if(result.industry) {
		data = result.industry;
		newJSON = { value : data, publish : false };
		result.industry = JSON.parse(JSON.stringify(newJSON));
	}
	
	if(result.interests) {
		data = result.interests;
		newJSON = { value : data, publish : false };
		result.interests = JSON.parse(JSON.stringify(newJSON));
	}
	
	if(result.pictureUrl) {
		data = result.pictureUrl;
		newJSON = { value : data, publish : false };
		result.pictureUrl = JSON.parse(JSON.stringify(newJSON));
	}
	
	if(result.publicProfileUrl) {
		data = result.publicProfileUrl;
		newJSON = { value : data, publish : false };
		result.publicProfileUrl = JSON.parse(JSON.stringify(newJSON));
	}
	
	if(result.specialties) {
		data = result.specialties;
		newJSON = { value : data, publish : false };
		result.specialties = JSON.parse(JSON.stringify(newJSON));
	}
	
	if(result.summary) {
		data = result.summary;
		newJSON = { value : data, publish : false };
		result.summary = JSON.parse(JSON.stringify(newJSON));
	}
};

