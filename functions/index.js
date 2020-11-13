const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
exports.pushNotification = functions.database
  .ref("/Message/{chatId}/{messageId}")
  .onCreate(snap => {
    let data = snap.val();
    const receiverId = data.receiverId;
    const payload = {
      notification: {
        title: `New message from ${data.name ? data.name : "OLX PK"}`, // the name of the sender
        body: data.message,
        icon: "Icon.png",//data.image ? data.image : "Icon",
        click_action: `anwers.html`
      }
    };
    console.info(`payload for ${receiverId}==>`, payload);

    let tokkens = [];
    return admin
      .database()
      .ref("/FCM_Tokken")
      .orderByKey()
      .equalTo(receiverId.substr(0, receiverId.indexOf(".")))
      .once("value")
      .then(tokenSnap => {
        if (tokenSnap.val()) {
          tokkens = Object.keys(
            tokenSnap.val()[receiverId.substr(0, receiverId.indexOf("."))]
          );
          console.log("tokkens==>", tokkens);
          return tokkens;
        }
        return [];
      })
      .then(tokkens => {
        console.log("sendinsg to==>", tokkens);
        return admin.messaging().sendToDevice(tokkens, payload);
      })
      .then(res => res)
      .catch(err => {
        console.info("an error==>", err);
      });
  });
