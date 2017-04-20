var scatterChart;
var ctx = $('#chart');
var SEARCH_RADIUS = 10;
function updateGraph() {
	var graphData = [];
	var closeReports = [];
	var type = $('#graph-type-drop').html();
	if (parseFloat($('#graph-lat').val()) !== NaN && parseFloat($('#graph-lng').val()) !== NaN) {
		$.each(waterReports, function(index, data) {
			var type = (data.virusPPM == -1 && data.contaminantPPM == -1) ? 'source' : 'purity';
			if (type === 'purity') {
				if (dist(data.x, data.y, parseFloat($('#graph-lat').val()), parseFloat($('#graph-lng').val())) < SEARCH_RADIUS) {
					closeReports.push(data.id);
				}
			}
		});
	}
	histRef.once('value', function(snapshot) {
		snapshot.forEach(function(childSnapshot) {
			var data = childSnapshot.val();
			if (closeReports.includes(childSnapshot.key)) {
				$.each(data, function(index, value) {
					var date = new Date(new Number(index));
					graphData.push({
						x: date.getMonth() + 1,
						y: type === 'Virus' ? value.virusPPM : value.contaminatePPM
					});
				});
			}
			
		});
		scatterChart = new Chart(ctx, {
			type: 'line',
			data: {
				datasets: [{
					label: type+' Dataset',
		            data: graphData
		        }]
		    },
		    options: {
		    	scales: {
		    		xAxes: [{
		    			type: 'linear',
		    			position: 'bottom'
		    		}]
		    	}
		    }
		});
    });
	
}
function dist(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}