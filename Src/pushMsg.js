//=====================================================================//
//===================HANDLE ALL PUSH NOTIFICATIONS HERE=================//
//=====================================================================//
firebase.messaging().onMessage(payload => {
  const { notification } = payload;
  iziToast.show({
    title: notification.title,
    message: notification.body,
    theme: "light",
    iconUrl: null,
    backgroundColor: "#ffffff",
    transitionIn: "fadeInUp",
    transitionOut: "fadeOut",
    transitionInMobile: "fadeInUp",
    transitionOutMobile: "fadeOutDown",
    progressBarColor: "#72bc83",
    timeout: 5000
  });
});
//=====================================================================//
//===================***********************************=================//
//=====================================================================//

//=====================================================================//
//===================SET THE TOKKEN TO CURRENT AUTH NODE=================//
//=====================================================================//

messaging.getToken().then(currentToken => {
  const tokkensRef = firebase.database().ref("FCM_Tokken");
  const currentAuth = localStorage.getItem("currentAuthId");
  if (currentAuth) {
    const authNodeRef = currentAuth.substr(0, currentAuth.indexOf("."));
    tokkensRef
      .child(authNodeRef)
      .child(currentToken)
      .set(true);
  }
});
