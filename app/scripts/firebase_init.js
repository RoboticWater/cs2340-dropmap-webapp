var config = {
	apiKey: "AIzaSyA4vAF4VgQMBao74x1KmxSFnpsr63EmmIQ",
	authDomain: "dropmapdb.firebaseapp.com",
	databaseURL: "https://dropmapdb.firebaseio.com",
	projectId: "dropmapdb",
	storageBucket: "dropmapdb.appspot.com",
	messagingSenderId: "100979827986"
};
firebase.initializeApp(config);

var database = firebase.database();
var waterReportRef = database.ref('/waterReports/');
var histRef = database.ref('/reportHistory/');
var userRef = database.ref('/users/');
var uid;
var authLevel;
var waterReports = [];
var markers = [];

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    uid = user.uid;
    userRef.child(uid).once('value', function(snapshot) {
      var data = snapshot.val();
      authLevel = data.authLevel;
      if (data.authLevel === 'Manager') {
        $('.graph-rel').removeClass('hide');
      }
      updateReports();
    });
  } else {
  	open('index.html', '_self', false);
  }
});

function retry() {
  userRef.child(uid).once('value', function(snapshot) {
      var data = snapshot.val();
      if (data.authLevel === 'Manager') {
        $('.purity-rel').removeClass('purity-rel');
        $('.graph-rel').removeClass('graph-rel');
      }
      if (data.authLevel === 'Worker') $('.purity-rel').removeClass('hide');
    });
}