function toggleSignIn() {
  if (firebase.auth().currentUser) {
    // [START signout]
    firebase.auth().signOut();
    // [END signout]
  } else {
    var email = document.getElementById("login").value;
    var password = document.getElementById("senha").value;
    if (email.length < 4) {
      alert('Please enter an email address.');
      return;
    }
    if (password.length < 4) {
      alert('Please enter a password.');
      return;
    }
    // Sign in with email and pass.
    // [START authwithemail]
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if (errorCode === 'auth/wrong-password') {
        alert('Wrong password.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
      document.getElementById('quickstart-sign-in').disabled = false;
      // [END_EXCLUDE]
    });
    // [END authwithemail]
  }
  document.getElementById('quickstart-sign-in').disabled = true;
}

/**
 * Handles the sign up button press.
 */
function handleSignUp() {
  var email = document.getElementById('new-login').value;
  var password = document.getElementById('new-senha').value;
  if (email.length < 4) {
    alert('Please enter an email address.');
    return;
  }
  if (password.length < 4) {
    alert('Please enter a password.');
    return;
  }
  // Sign in with email and pass.
  // [START createwithemail]
  firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
        var user = firebase.auth().currentUser;
        firebaseConnection.database().ref(user.uid).set(
            {
                'familiars':{
                    1:{'email':user.email, 'uid':user.uid}
                }
            });
    }, function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/weak-password') {
          alert('The password is too weak.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
    // [END_EXCLUDE]
  });
  // [END createwithemail]
}

/**
 * Sends an email verification to the user.
 */
function sendEmailVerification() {
  // [START sendemailverification]
  firebase.auth().currentUser.sendEmailVerification().then(function() {
    // Email Verification sent!
    // [START_EXCLUDE]
    alert('Email Verification Sent!');
    // [END_EXCLUDE]
  });
  // [END sendemailverification]
}

function sendPasswordReset() {
  var email = document.getElementById('email').value;
  // [START sendpasswordemail]
  firebase.auth().sendPasswordResetEmail(email).then(function() {
    // Password Reset Email Sent!
    // [START_EXCLUDE]
    alert('Password Reset Email Sent!');
    // [END_EXCLUDE]
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // [START_EXCLUDE]
    if (errorCode == 'auth/invalid-email') {
      alert(errorMessage);
    } else if (errorCode == 'auth/user-not-found') {
      alert(errorMessage);
    }
    console.log(error);
    // [END_EXCLUDE]
  });
  // [END sendpasswordemail];
}

/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
function initApp() {
  // Listening for auth state changes.
  firebase.auth().onAuthStateChanged(function(user) {
    document.getElementById("nav-login").style.display = "block";
    document.getElementById("nav-logout").style.display = "none";
    document.getElementById("content").style.display = "none";
    document.getElementById("login-content").style.display = "block";
    if (user) {
      // User is signed in.
      if(user.displayName){
          document.getElementById("config").innerHTML = user.displayName;
      }else{
          document.getElementById("config").innerHTML = user.email;
      }
      document.getElementById("nav-login").style.display = "none";
      document.getElementById("nav-logout").style.display = "block"
      document.getElementById("login-content").style.display = "none";
      document.getElementById("content").style.display = "block";
      window.sessionStorage.setItem('base', user.uid);
      checarLogin();
    } else {
      // User is signed out.
      document.getElementById("nav-login").style.display = "block";
      document.getElementById("nav-logout").style.display = "none";
      document.getElementById("content").style.display = "none";
      document.getElementById("login-content").style.display = "block";
    }
  });
}

function updateUserProfile() {
    user.updateProfile({
      displayName: document.getElementById("username").value
    }).then(function() {
      // Update successful.
    }, function(error) {
      // An error happened.
    });
}

window.onload = function() {
  initApp();
};
