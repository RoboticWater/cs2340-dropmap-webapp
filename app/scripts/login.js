var config = {
  apiKey: "AIzaSyA4vAF4VgQMBao74x1KmxSFnpsr63EmmIQ",
  authDomain: "dropmapdb.firebaseapp.com",
  databaseURL: "https://dropmapdb.firebaseio.com",
  projectId: "dropmapdb",
  storageBucket: "dropmapdb.appspot.com",
  messagingSenderId: "100979827986"
};
firebase.initializeApp(config);

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    open('map.html','_self',false);
  } else {
    // No user is signed in.
  }
});

$(document).ready(function(){
  $('.btn-lg').on('click', login);
  $('.btn-rg').on('click', register);
  $('#header-reg').on('click', function() {
    $('#hide-login').removeClass('vis');
    $('#hide-reg').addClass('vis');
  });
  $('#header-login').on('click', function() {
    $('#hide-reg').removeClass('vis');
    $('#hide-login').addClass('vis');
  });
});
function changeDropDown(id, val) {
  $('#' + id).text(val);
}
function login() {
  $('.alert').remove();
  var noEmail = !$('#inputEmail').val();
  var noPass = !$('#inputPassword').val();
  if (noEmail) {
    $('#signin-card').append('<div class="alert alert-danger" role="alert">\
      <strong>Oh snap!</strong> I find your lack of Email disturbing.\
      </div>');
  }
  if (noPass) {
    $('#signin-card').append('<div class="alert alert-danger" role="alert">\
      <strong>Oh snap!</strong> Ugh, I can\'t bother making a witty reference here... Anyway, you need a password, honey\
      </div>');
  }
  if (noEmail || noPass) return;
  var email= $("#inputEmail").val();
  var password= $("#inputPassword").val();
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
  });
}
function register() {
  var email = $('#regEmail').val();
  var password = $('#regPassword').val();
  firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
    firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
    });
  }).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
  });
}