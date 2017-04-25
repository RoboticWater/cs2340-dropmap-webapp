var map;
 $(window).bind('hashchange', function() {
 	var loc = location.hash.slice(1).replace('#','').split(',');
 	map.setCenter(new google.maps.LatLng( loc[0], loc[1] ) );
})
function updateMarkers() {
	clearOverlays();
	$.each(waterReports, function(index, data) {
		var m = new google.maps.Marker({
		  position: {lat: data.x, lng: data.y},
		  map: map,
		  title: data.reportName
		})
		var contentString = '<div id="content">'+
            '<h1 id="firstHeading" class="firstHeading">' + data.reportName + '</h1>'+
            '<div id="bodyContent">'+
            '<p>' + data.type + '</p>'+
            '<p>' + data.condition + '</p>' + 
           	'<a href="#" onclick="showEditReport(\'' + data.id + '\')">View Report</a> '+
           	(authLevel !== 'User' ?'<a href="#" onclick="showUpdateReport(\'' + data.id + '\')">Update Report</a> ' : '')+
            '</div>'+
            '</div>';
        var infowindow = new google.maps.InfoWindow({
          content: contentString
        });
        m.addListener('click', function() {
        	infowindow.open(map, m);
        })
		markers.push(m);
	});
}
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
	+  '<a id="menu2" onclick="showGraph(' + latLng.lat() + ',' + latLng.lng() + ')">View Graph at Location<\/a>';

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

function showAddReport(lat, lng) {
	$('.contextmenu').remove();
	$('#add-report').modal("show");
	if (lat != null) $('#add-lat').val(lat);
	if (lng != null) $('#add-lng').val(lng);
}

function clearOverlays() {
  for (var i = 0; i < markers.length; i++ ) {
    markers[i].setMap(null);
  }
}