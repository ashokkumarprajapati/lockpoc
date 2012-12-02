function setFlag() { 
 
  json = {
    "educations": {
        "_total": 3,
            "values": [
            {
              "activities": "",
               "degree": "Bachelor of Information Technology",
               "endDate": {
                 "year": 2005
               },
               "fieldOfStudy": "Information Technology",
               "id": 13070824,
               "notes": "",
               "schoolName": "Indira Gandhi National Open University",
               "startDate": {
               "year": 2001
               },
               "publish": true
             }, 
           {
              "activities": "",
               "degree": "Bachelor of Information Technology",
               "endDate": {
                 "year": 2005
               },
               "fieldOfStudy": "Information Technology",
               "id": 13070824,
               "notes": "",
               "schoolName": "Indira Gandhi National Open University",
               "startDate": {
               "year": 2001
               },
               "publish": true
             }, 
             {
               "endDate": {
                 "year": 1997
               },
               "id": 77668801,
               "notes": "",
               "schoolName": "Zila School, Bhagalpur, Bihar",
               "startDate": {
               "year": 1992
             },
               "publish": false
           }
        ]
    }
};

 // filter out all the private fields
 function strip_flags(jsonIn) {
 	json = {};

    if( typeof jsonIn == "object" ) {
        $.each(jsonIn, function(k,v) {            
            // k is either an array index or object key
            if (k=="publish")
            {
              //console.log(k+":"+v);
              //console.log(jsonIn);
              //jsonOut.push(k+":"+v);
            }
            else
            	strip_flags(v);
        });
    }
    return json;
  }

var source   = $("#education").html();
var template = Handlebars.compile(source);
var $results = $('#profile');
var profile ={};
var map = json.educations.values; // this is an array
 
 for(i=0; i<json.educations._total;i++)
 {
   context = {"education":json.educations.values[i],"ref":+i};
   //console.log(map[i]);
   degree=template(context);
   $results.append(degree);
 } 

      $("#profile-json").html("<br><b>Private Profile:</b><br>"+JSON.stringify(json));
      /*
      profile = strip_flags(json);*/
      profile=json;
      $("#profile-json").append("<br><b>Public Profile:</b><br>"+JSON.stringify(profile));


 // now hook up the toggle event handler and set to reflect current publish status
  $('.toggler').each(function(index) {
    $(this).click(function(elem) {
      el = $(this);
      //console.log(el.context.id);
      id =el.context.id;

      //console.log(id);
      if (el.hasClass("public"))
      {
      	el.removeClass("public");
      	map[id].publish=false;
       }
      else
      {
     	el.addClass("public");
       	map[id].publish=true;
     }

      $("#profile-json").html("<br><b>Private Profile:</b><br>"+JSON.stringify(json));
      /*
      profile = strip_flags(json);*/
      profile=json;
      $("#profile-json").append("<br><b>Public Profile:</b><br>"+JSON.stringify(profile));
      
    }); 

  });
}
