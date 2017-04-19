var scatterChart;
var ctx = $('#chart');
var SEARCH_RADIUS = 10;
function updateGraph() {
	var graphData;
	if (parseFloat($('#input-lat').val(lat)) !== NaN && parseFloat($('#input-lng').val(lng)) !== NaN) {
		$.each(waterReports, function(index, data) {
			var type = (data.virusPPM == -1 && data.contaminantPPM == -1) ? 'source' : 'purity';
			if (typt === 'purity') {
				if (dist(dist.x, dist.y, parseFloat($('#input-lat').val(lat)), parseFloat($('#input-lng').val(lng))) < SEARCH_RADIUS) {
					
				}
			}
		});
	}
	scatterChart = new Chart(ctx, {
		type: 'line'
	})
}
function dist(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1));
}