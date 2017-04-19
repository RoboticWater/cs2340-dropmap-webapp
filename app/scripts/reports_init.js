$(function() {
	$('#reports').empty();
	$.each(waterReports, function(index, data) {
    	$('#reports').append(buildReportButton(data.reportName, data.id, [data.x, data.y], type));
	})
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
});