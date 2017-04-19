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
	var ref = userRef.ref(uid);
	ref.set({
		name: $('#prof-name').val(),
		email: $('#prof-email').val(),
		authLevel: $('#prof-uname').val()
	});
	if ($('#prof-pass').val() === $('#prof-npass').val()) {
		ref.set({
			password: $('#prof-pass').val()
		});
	}
}