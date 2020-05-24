import firebase from 'firebase/app';
import 'firebase/firebase-auth';
import 'firebase/database';
import 'firebase/firestore';
import { user, timerStore, toast } from './store.js';

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAj6w4NQMDRvucPXJbYACnSsnRaCRgz0t8",
    authDomain: "crosstimer-b7c1a.firebaseapp.com",
    databaseURL: "https://crosstimer-b7c1a.firebaseio.com",
    projectId: "crosstimer-b7c1a",
    storageBucket: "crosstimer-b7c1a.appspot.com",
    messagingSenderId: "674220766665",
    appId: "1:674220766665:web:c34e2b562fc383d4d1e418"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var provider = new firebase.auth.GoogleAuthProvider();
const db = firebase.firestore();
var userUid = null;

user.subscribe(value => {
    if (!!value) {
        userUid = value.uid;
    }
});

function showToast(message, time) {
    toast.set({message: message, time: time});
}

firebase.auth().onAuthStateChanged((userFirebase) => {
    if (!!userFirebase) {
        user.set(userFirebase);

        var docRef = db.collection("users").doc(userFirebase.uid).collection("timers");

        docRef.get().then((doc) => {
            if (!!doc.docs  && doc.docs.length > 0) {
                var timersArray = {};
                doc.docs.forEach(doc => {
                    var docData = doc.data();
                    timersArray[docData.name] = {
                        rounds: docData.rounds,
                        time: docData.time,
                    }
                });

                timerStore.set(timersArray);
            } else {
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
    }
});

// If user logged in
firebase.auth().getRedirectResult().then(function(result) {
    if (result.user !== null) {
        user.set(result.user);
        showToast("Connected", 3000);
    }
}).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
});

export let connectFirebase = () => {
    // persistence en local de la connexion
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(function() {
            return firebase.auth().signInWithRedirect(provider);
        })
        .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
        });
}

export let disconnectFirebase = () => {
    firebase.auth().signOut().then(function() {
        showToast("Disconnected", 3000);
        user.set(null);
    }).catch(function(error) {
        // An error happened.
    });
}

export let addTimer = (timer) => {
    db.collection("users").doc(userUid).collection("timers").add(timer);
}

