var ge;

var globLat;
var globLng;

var maillingList = [];

google.load("earth", "1");

$(document).ready(function(event){

  // If HTML5 location exists, get it and update the fields.
  if (navigator.geolocation) {
	
    navigator.geolocation.getCurrentPosition(fillOutLocation, errorLocation); 
  }
  else {
    errorLocation();
  }
  
  google.earth.createInstance('map3d', initCallback, failureCallback);
  
});

// Error in location.
function errorLocation() {
  $("#messagearea").html("Could not load your location");
}


// When HTML5 location gets in, update the fields.
function fillOutLocation(position) {
	//alert(position.coords.latitude + ' , ' + position.coords.longitude);
	globLat =position.coords.latitude;
	globLng =position.coords.longitude;			 
}


function initCallback(pluginInstance) {
  ge = pluginInstance;
  ge.getWindow().setVisibility(true);

  // add a navigation control
  ge.getNavigationControl().setVisibility(ge.VISIBILITY_AUTO);

  // add some layers
  ge.getLayerRoot().enableLayerById(ge.LAYER_BORDERS, true);
  ge.getLayerRoot().enableLayerById(ge.LAYER_ROADS, true);

  // just for debugging purposes
  document.getElementById('installed-plugin-version').innerHTML =
  ge.getPluginVersion().toString();
  
  
  //For the rotateEarth function
  ge.getOptions().setFlyToSpeed(4); 
  google.earth.addEventListener(ge, "frameend", rotateEarth); 
  
  //Click event
  // listen to the click event on the globe and window
  google.earth.addEventListener(ge.getGlobe(), 'click', eventHandler);
  //google.earth.addEventListener(ge.getWindow(), 'click', eventHandler);
  
  function eventHandler(event) {
    	
	//alert('remove me!');
	google.earth.removeEventListener(ge, "frameend", rotateEarth);
   
    // Prevent default balloon from popping up for marker placemarks
    event.preventDefault();

  }
  
  
  //
  //flyLocation();
  
  //
  rotateEarth();
  
  //Guest Marker
  createPlacemark(globLat,globLng,'Simon Pouliot',"Blue");
  
  var listUsers = [ {'name':'Simon', 'age':24, 'level':'Legend', 'lat':43,'lng':-43},
					{'name':'Mathieu', 'age':22, 'level':'General', 'lat':44,'lng':-13},
					{'name':'Ben', 'age':21, 'level':'Expert', 'lat':45,'lng':-93},
					{'name':'Thomas', 'age':26, 'level':'New', 'lat':46,'lng':-170},
					{'name':'Veronica', 'age':20, 'level':'Captain', 'lat':47,'lng':-123}
				  ];
  
  
  //Marker of all members
  for (var i=0; i < listUsers.length; i++){
	  createPlacemark(listUsers[i]['lat'],listUsers[i]['lng'],listUsers[i]['name'] + ', ' + listUsers[i]['level'] + ', Age:' + listUsers[i]['age'], "red");
	}
  
  
  
}

function flyLocation() {
   
  var lookAt = ge.createLookAt('');
  lookAt.set(globLat,globLng, 10, ge.ALTITUDE_RELATIVE_TO_GROUND,0, 10, 2000000);
  ge.getView().setAbstractView(lookAt);
  
}

function rotateEarth(){ 

       google.earth.addEventListener(ge, "frameend", rotateEarth); 
       var lookAt = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND); 
       var myLon = lookAt.getLongitude(); 
       
	   if (myLon<350) { myLon = myLon + 10; } else { myLon=0; } 
       
	   lookAt.setLongitude(myLon); 
	   lookAt.setRange(15000000);
       //lookAt.setHeading(0);   // Workaround for heading bug, issue  
       ge.getView().setAbstractView(lookAt); 
}


function createPlacemark(_lat,_lng,_userName,_color) {
	
  var placemark = ge.createPlacemark('');
  placemark.setName(_userName);
  ge.getFeatures().appendChild(placemark);

  // Create style map for placemark
  var icon = ge.createIcon('');
  if(_color=="red"){
  	icon.setHref('http://maps.google.com/mapfiles/kml/paddle/red-circle.png');
  }
  else{
	icon.setHref('http://gd.bbbsfoundation.org/gd.donations/images/icon_marker_blue.png');
  }
  var style = ge.createStyle('');
  style.getIconStyle().setIcon(icon);
  style.getIconStyle().setScale(5.0);
  placemark.setStyleSelector(style);

  // Create point
  var la = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
  var point = ge.createPoint('');
  point.setLatitude(_lat);
  point.setLongitude(_lng);
  placemark.setGeometry(point);
  
  
  //EVENT
  google.earth.addEventListener(placemark, 'click', myEventHandler);

}



function myEventHandler(event) {
  // wrap alerts in API callbacks and event handlers
  // in a setTimeout to prevent deadlock in some browsers
  setTimeout(function() {
					  
	console.debug(event.getTarget());
	
	var placemark = event.getTarget();
	
	var _lat = placemark.getGeometry().getLatitude();
	var _lng = placemark.getGeometry().getLongitude();
	var _name = placemark.getName();
	
	placemark.setVisibility(false);
	
	createPlacemark(_lat,
					_lng,
					_name,
					"Blue");
	
	//Ajout de lutilisateur sélectionné à la liste
	maillingList.push(_name)
	
  }, 0);
}
 

function failureCallback(errorCode) {
}