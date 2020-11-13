importScripts("https://www.gstatic.com/firebasejs/5.4.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/5.4.1/firebase-messaging.js");

firebase.initializeApp({
  messagingSenderId: "251615634628"
});

const messaging = firebase.messaging();