var config = {
	apiKey: "AIzaSyA4vAF4VgQMBao74x1KmxSFnpsr63EmmIQ",
	authDomain: "dropmapdb.firebaseapp.com",
	databaseURL: "https://dropmapdb.firebaseio.com",
	projectId: "dropmapdb",
	storageBucket: "dropmapdb.appspot.com",
	messagingSenderId: "100979827986"
};
firebase.initializeApp(config);
var map;
var markers = {};
var database = firebase.database()

var uid;
var waterReports;

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    uid = user.uid;
  } else {
    // No user is signed in.
  }
});

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
	  zoom: 4,
	  center: {lat: 30, lng: -80}
	});
	google.maps.event.addListener(map, "rightclick", function(event) {
		showContextMenu(event.latLng);
	});
	google.maps.event.addListener(map, "click", function(event) {
		hideContextMenu();
	});
}
function showContextMenu(latLng) {
	$('.contextmenu').remove();
	var contextmenuDir = document.createElement("div");
	contextmenuDir.className  = 'contextmenu';
	contextmenuDir.innerHTML = '<a id="menu1" onclick="showAddReport(' + latLng.lat() + ',' + latLng.lng() + ')">Add Report at Location<\/a>'
	+ '<a id="menu2" onclick="showGraph(' + latLng.lat() + ',' + latLng.lng() + ')">View Graph at Location<\/a>';

	$(map.getDiv()).append(contextmenuDir);

	setMenuXY(latLng);

	contextmenuDir.style.visibility = "visible";
}
function hideContextMenu() {
	$('.contextmenu').remove();
}
function getCanvasXY(caurrentLatLng){
	var scale = Math.pow(2, map.getZoom());
	var nw = new google.maps.LatLng(
		map.getBounds().getNorthEast().lat(),
		map.getBounds().getSouthWest().lng()
		);
	var worldCoordinateNW = map.getProjection().fromLatLngToPoint(nw);
	var worldCoordinate = map.getProjection().fromLatLngToPoint(caurrentLatLng);
	var caurrentLatLngOffset = new google.maps.Point(
		Math.floor((worldCoordinate.x - worldCoordinateNW.x) * scale),
		Math.floor((worldCoordinate.y - worldCoordinateNW.y) * scale)
		);
	return caurrentLatLngOffset;
}
function setMenuXY(caurrentLatLng) {
	var mapWidth = $('#map').width();
	var mapHeight = $('#map').height();
	var menuWidth = $('.contextmenu').width();
	var menuHeight = $('.contextmenu').height();
	var clickedPosition = getCanvasXY(caurrentLatLng);
	var x = clickedPosition.x ;
	var y = clickedPosition.y ;
	if((mapWidth - x ) < menuWidth)//if to close to the map border, decrease x position
		x = x - menuWidth;
	if((mapHeight - y ) < menuHeight)//if to close to the map border, decrease y position
		y = y - menuHeight;
	$('.contextmenu').css('left', x);
	$('.contextmenu').css('top', y);
};
$(document).ready(function () {
	$('#reports').empty();
	var reports = database.ref('/waterReports/');
	reports.once('value', function(snapshot) {
	  snapshot.forEach(function(childSnapshot) {
	    var childKey = childSnapshot.key;
	    var data = childSnapshot.val();
	    waterReports.push(data);
	    var type = (data.virusPPM == -1 && data.contaminantPPM == -1) ? 'source' : 'purity';
	    markers[data.id] = new google.maps.Marker({
          position: {lat: data.x, lng: data.y},
          map: map
        });
	    $('#reports').append(buildReportButton(data.reportName, data.id, [data.x, data.y], type));
	  });
	  console.log(reports);
	});
	$('input[name=options]').on('change', function() {
		var value = $('#report-filter  input:radio:checked').val();
		$('#reports').children().each(function() {
			if (value === 'all') {
				$(this).removeClass('off');
			} else if (value === 'source') {
				if ($(this).children('.name').attr('data-type') ==='source')
					$(this).removeClass('off');
				else
					$(this).addClass('off');
			} else {
				if ($(this).children('.name').attr('data-type') ==='purity')
					$(this).removeClass('off');
				else
					$(this).addClass('off');
			}
		});
	});
	$('#btn-add-report').on('click', function() {
		showAddReport();
	});
	$('#btn-graph').on('click', function() {
		showGraph();
	});
});
 $(window).bind('hashchange', function() {
 	var loc = location.hash.slice(1).replace('#','').split(',');
 	map.setCenter(new google.maps.LatLng( loc[0], loc[1] ) );
})

function buildReportButton(name, id, location, type) {
	return '<div class="btn-group btn-report" role="group" aria-label="' + id +'">\
	           <a class="btn name btn-outline-primary" data-type="' + type + '" href="" role="button">' + name + '</a>\
	           <a class="btn loc btn-secondary end" href="#' +  location[0] + ',' + location[1] + '" role="button"><i class="fa fa-map-marker" aria-hidden="true"></i></a>\
          	</div>'
}

function showEditProfile() {
	var reports = database.ref('/users/' + uid);
	reports.once('value', function(snapshot) {
		var data = snapshot.val();
		$('#prof-name').val(data.name);
		$('#prof-email').val(data.email);
		$('#prof-uname').val(data.username);
		changeDropDown('auth-drop', data.authLevel);
	});
	$('#edit-profile').modal("show");
}

function changeDropDown(id, val) {
	$('#' + id).text(val);
}

function showAddReport(lat, lng) {
	$('.contextmenu').remove();
	$('#add-report').modal("show");
	if (lat != null) $('#input-lat').val(lat);
	if (lng != null) $('#input-lng').val(lng);
}
var lineChart;
var ctx = $('#chart')
function showGraph(lat, lng) {
	$('.contextmenu').remove();
	$('#graph').modal("show");
	if (lat != null) $('#input-lat').val(lat);
	if (lng != null) $('#input-lng').val(lng);
	lineChart = new Chart(ctx, {
		type: 'scatter'
	});
}

function validateAddWaterReport() {

}
function validateEditWaterReport() {

}
function validateProfile() {

}

function signOut() {
	firebase.auth().signOut().then(function() {
    	open('index.html','_self',false);
	}, function(error) {
		alert('Sign Out Error; ' + error);
	});
}

function submitReport() {
	var reports = database.ref('/waterReports/');
	var data = {};
	data.name = 
	data.uid =
	data.rid =
	data.x =
	data.y =
	reports.push(data);
}

