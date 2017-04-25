function showEditProfile() {
	userRef.child(uid).once('value', function(snapshot) {
		var data = snapshot.val();
		$('#prof-name').val(data.name);
		$('#prof-email').val(data.email);
		$('#prof-uname').val(data.username);
		changeDropDown('auth-drop', data.authLevel);
	});
	$('#edit-profile').modal("show");
}
function saveEditProfile() {
	var ref = userRef.child(uid);
	authLevel = $('#auth-drop').html();
	ref.child('name').set($('#prof-name').val());
	ref.child('email').set($('#prof-email').val());
	ref.child('authLevel').set($('#auth-drop').html());
	if ($('#prof-pass').val().length > 0) {
		ref.child('password').once('value', function(snapshot) {
			if ($('#prof-pass').val() === snapshot.val()) {
				ref.child('password').set($('#prof-npass').val());
			}
		});
	}
	$('#prof-npass').val('');
	$('#prof-pass').val('');
	$('#edit-profile').modal("toggle");
	updateMarkers();
	updateReports();
	if (authLevel === 'Manager') {
		$('.graph-rel').removeClass('hide');
	} else {
		$('.graph-rel').addClass('hide');
	}
}