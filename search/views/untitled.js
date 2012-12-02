        function do_search(facets) {
        	var facets = "{facets}";
        	var str = facets.replace(new RegExp(/&quot;/g),"\"");
        	facets = jQuery.parseJSON(str);
        	var query = "";

        	if(facets.text) { query = query + "_all:" + (facets.text).toLowerCase() + " "; }
        	if(facets.role) { query = query + "linkedin.positions.values.title:" + (facets.role).toLowerCase() + " "; }
        	if(facets.country) { query = query + "linkedin.location.name:" + (facets.country).toLowerCase() + " "; }
        	if(facets.skill) { query = query + "linkedin.skills.values.skill.name:" + (facets.skill).toLowerCase() + " "; }

        	$.ajax({ url: 'http://lockbox.egi.ericsson.com:9200/lockpoc/profiles/_search?analyzer=auto_complete&pretty=true'
        		, type: 'POST'
        		, data : JSON.stringify({ 
        			"fields" : ["_source.linkedin.headline", "_source.linkedin.firstName", "_source.linkedin.lastName", 
        			"_source.linkedin.pictureUrl", "_source.linkedin.location.name"],
        			"query": { "query_string": { "query": query }
        		}}), dataType : 'json', processData: false, success: function(data, statusText, xhr) {
        			
        			var hits = data.hits.hits;
        			var htmlContent = "";
        			for(var i in hits) {
        				var profileUrl = 'http://statsdsxs.egi.ericsson.com:8084/#/' + hits[i]._id;
        				var fields = hits[i].fields;
        				var image = fields["_source.linkedin.pictureUrl"].value;
        				var name = fields["_source.linkedin.firstName"].value + " " + fields["_source.linkedin.lastName"].value;
        				var headline = fields["_source.linkedin.headline"].value;
        				var location = fields["_source.linkedin.location.name"];
        				
        				htmlContent += '<ol id="result-set" class="photos ab-blue-button">' +
        				'<li class="vcard first  basic" id="vcard-0">' +
        				'<div class="result-data">' +
        				'<a href="' + profileUrl + '" target="_top" tracking="hb_upphoto" data-li-larger-profile="' + image +'">' +
        				'<img src="' + image +'" class="photo" alt="<name>" width="60" height="60">' +
        				'<span class="larger-profile-photo-control"></span> </a> <h2>' +
        				'<a href="' + profileUrl +'" class="fn n external-link trk-profile-name" title="View Profile" target="_top">' + name +'</a>' +
        				'<span class="badges"> </span> </h2> <dl class="vcard-basic"> <dt>Title</dt> <dd class="title">' + headline + '</dd>' +
        				'<dt class="demographic-info">Demographic info</dt> <dd class="location-industry"> <span class="location">' + location + '</span>' +
        				'<span class="separator">·</span> <span class="industry"> Internet </span> </dd> </dl>' +
        				'<dl class="vcard-expanded"> <dt class="incommon-connections">In Common:</dt> </dl> </div> </li> </span> </ol>';
        			}
        			
        			$('div#search-results').html(htmlContent);
        		}
        		,error: function(xhr, message, error) {
        			console.error("Error in search", message);
        			throw(error);
        		}
        	}
        }
