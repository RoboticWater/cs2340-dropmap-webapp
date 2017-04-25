$(function () {
	$('#btn-add-report').on('click', function() {
		showAddReport();
	});
	$('#btn-graph').on('click', function() {
		showGraph();
	});
	waterReportRef.once('value', function(snapshot) {
	  snapshot.forEach(function(childSnapshot) {
	    waterReports.push(childSnapshot.val());
	  });
	  updateMarkers();
	  updateReports();
	});
});

function buildReportButton(name, id, location, type) {
	return '<div class="btn-group btn-report" role="group" aria-label="' + id +'">'+
	           '<a class="btn name btn-outline-primary" data-type="' + type + '" href="#" role="button" onclick="showEditReport(\'' + id +'\')">' + name + '</a>'
	           + (authLevel !== 'User' ? '<a class="btn loc btn-secondary end purity-rel" href="#" role="button" onclick="showUpdateReport(\'' + id +'\')""><i class="fa fa-plus" aria-hidden="true"></i></a>' : '') + 
	           '<a class="btn loc btn-secondary end" href="#' +  location[0] + ',' + location[1] + '" role="button"><i class="fa fa-map-marker" aria-hidden="true"></i></a>'+
          	'</div>';
}

function changeDropDown(id, val) {
	$('#' + id).text(val);
}
function showGraph(lat, lng) {
	$('.contextmenu').remove();
	$('#graph').modal("show");
	if (lat != null) $('#graph-lat').val(lat);
	if (lng != null) $('#graph-lng').val(lng);
	updateGraph();
}

function validateAddWaterReport() {
	$('#add-report .alerts').empty();
	var isFine = true;
	if (parseFloat($('#add-lat').val()) === NaN) {
		isFine = false;
		$('#add-report .alerts').append('<div class="alert alert-danger" role="alert">\
      <strong>Oh snap!</strong> Latitude needs to be a number.\
      </div>');
	}
	if (parseFloat($('#add-lng').val()) === NaN) {
		isFine = false;
		$('#add-report .alerts').append('<div class="alert alert-danger" role="alert">\
      <strong>Oh snap!</strong> Longitude needs to be a number.\
      </div>');
	}
	if (!(/\S/.test($('#add-name').val()))) {
		isFine = false;
		$('#add-report .alerts').append('<div class="alert alert-danger" role="alert">\
      <strong>Oh snap!</strong> Report needs name.\
      </div>');
	}
	return isFine;
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
	if (!validateAddWaterReport()) return;
	$('#add-report').modal('toggle');
	var ref = waterReportRef.push();
	var data = {
		reportName: $('#add-name').val(),
		user: uid,
		id: ref.key,
		x: parseFloat($('#add-lat').val()),
		y: parseFloat($('#add-lng').val()),
		condition: $('#add-cond-drop').html(),
		type: $('#add-type-drop').html(),
		virusPPM: -1,
		contaminantPPM: -1
	};
	ref.set(data);
	waterReports.push(data);
	updateMarkers();
	updateReports();
}

function updateReports() {
	$('#reports').empty();
	$.each(waterReports, function(index, data) {
		var type = (data.virusPPM == -1 && data.contaminantPPM == -1) ? 'source' : 'purity';
		$('#reports').append(buildReportButton(data.reportName, data.id, [data.x, data.y], type));
	});
}
var curReport;
function showEditReport(id) {
	$('#edit-report').modal("show");
	$.each(waterReports, function(index, data) {
		if (data.id === id) {
			curReport = data;
			$('#edit-name').val(data.reportName);
			$('#edit-type-drop').html(data.type);
			$('#edit-cond-drop').html(data.condition);
			$('#edit-lat').val(data.x);
			$('#edit-lng').val(data.y);
			return false;
		}
	})
}
function editReport() {
	if (!validateEditWaterReport()) return;
	$('#edit-report').modal('toggle');
	var ref = waterReportRef.child('/' + curReport.id);
	var newData = {
		reportName: $('#edit-name').val(),
		user: uid,
		id: ref.key,
		x: parseFloat($('#edit-lat').val()),
		y: parseFloat($('#edit-lng').val()),
		condition: $('#edit-cond-drop').html(),
		type: $('#edit-type-drop').html(),
		virusPPM: -1,
		contaminantPPM: -1
	};
	ref.set(newData);
	var i = -1;
	$.each(waterReports, function(index, data) {
		if (data.id === ref.key) {
			i = index;
			return false;
		}
	})
	if ( i !== -1) {
		waterReports[i] = newData;
	}
	updateMarkers();
	updateReports();
}
function validateEditWaterReport() {
	$('#edit-report .alerts').empty();
	var isFine = true;
	if (parseFloat($('#edit-lat').val()) === NaN) {
		isFine = false;
		$('#edit-report .alerts').append('<div class="alert alert-danger" role="alert">\
      <strong>Oh snap!</strong> Latitude needs to be a number.\
      </div>');
	}
	if (parseFloat($('#edit-lng').val()) === NaN) {
		isFine = false;
		$('#edit-report .alerts').append('<div class="alert alert-danger" role="alert">\
      <strong>Oh snap!</strong> Longitude needs to be a number.\
      </div>');
	}
	if (!(/\S/.test($('#edit-name').val()))) {
		isFine = false;
		$('#edit-report .alerts').append('<div class="alert alert-danger" role="alert">\
      <strong>Oh snap!</strong> Report needs name.\
      </div>');
	}
	return isFine;
}

function showUpdateReport(id) {
	$('#update-report').modal("show");
	$.each(waterReports, function(index, data) {
		if (data.id === id) {
			curReport = data;
			if (data.virusPPM !== -1) $('#update-virus').val(data.virusPPM);
			if (data.contaminantPPM !== -1) $('#update-cont').val(data.contaminantPPM);
			return false;
		}
	})
}

function updateReport() {
	if (!validateUpdateReport()) return;
	$('#update-report').modal('toggle');
	var ref = waterReportRef.child('/' + curReport.id);
	curReport.virusPPM = parseFloat($('#update-virus').val());
	curReport.contaminantPPM = parseFloat($('#update-cont').val());
	ref.set(curReport);
	updateHistory(curReport, parseFloat($('#update-virus').val()), parseFloat($('#update-cont').val()));
	var i = -1;
	$.each(waterReports, function(index, data) {
		if (data.id === ref.key) {
			i = index;
			return false;
		}
	})
	if ( i !== -1) {
		waterReports[i] = curReport;
	}
}
function validateUpdateReport() {
	$('#update-report .alerts').empty();
	var isFine = true;
	if (parseFloat($('#update-virus').val()) === NaN) {
		isFine = false;
		$('#edit-report .alerts').append('<div class="alert alert-danger" role="alert">\
      <strong>Oh snap!</strong> Virus needs to be a number.\
      </div>');
	}
	if (parseFloat($('#update-cont').val()) === NaN) {
		isFine = false;
		$('#edit-report .alerts').append('<div class="alert alert-danger" role="alert">\
      <strong>Oh snap!</strong> Contaminant needs to be a number.\
      </div>');
	}
	return isFine;
}

function updateHistory(report, vir, cont) {
	var time = String(new Date().getTime());
	histRef.child(report.id).child(time).set({
		virusPPM: vir,
		contaminatePPM: cont
	});
}