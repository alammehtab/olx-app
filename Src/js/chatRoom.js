//REGISTER DOM ELEMENTS AND OTHER VARIABLES
var userChatsRef = firebase.database().ref("UserChats");
var chatsRef = firebase.database().ref("Chats");
var usersRef = firebase.database().ref("Users");
var fcmTokkensRef = firebase.database().ref("FCM_Tokken");
var chatContent = document.getElementById("chatContent");
var currentChat_Id;
var authUserName = "";
var authUserId = "";
var authProfile = "";
var messagesRef = firebase.database().ref("Message");
var chatHeaderCont = document.getElementById("chatHeader");
var whomUNameCont = chatHeaderCont.getElementsByClassName("heading")[0];
var chatTitleCont = chatHeaderCont.getElementsByClassName("chat-title")[0];
var inputFeild = document
  .getElementById("chatInput")
  .getElementsByClassName("input-text")[0];
var chatTitle = "";
var owner_Id = "";
var buyer_Id = "";
const messaging = firebase.messaging();

function prepareChatRoom() {
  //check if the user is already signed than show chatroom else firts signin
  //console.log(user);
  // authUserId = user.email;
  // //GET THE PROFILE OF CURRENT authUSER
  let user = localStorage["currentAuthId"];
  if (user) {
    authUserId = user;
    fetch(`http://localhost:5001/signin/${user}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    })
      .then(res => {
        return res.json();
      })
      .then(json => {
        let obj = json[0];
        authUserName = obj.name;
        authProfile = obj.image;
        fetchMessages();
      })
      .catch(err => {
        console.log(err);
      });
    // var callBack = usersRef
    //   .orderByChild("email")
    //   .equalTo(user)
    //   .once("value")
    //   .then(snapshot => {
    //     userOb = snapshot.val();
    //     for (const key in userOb) {
    //       //console.log(userOb[key]);
    //       authUserName = userOb[key].name;
    //       authProfile = userOb[key].image;
    //       fetchMessages();
    //     }
    //   })
    //   .catch(e => {
    //     console.log("Error", e);
    //   });
  } else {
    // authUserName = (user.displayName!=null ? user.displayName : authUserId.substr(0,authUserId.indexOf('.')));
    // authProfile = (user.photoURL!=null?user.photoURL:'../Assets/Images/Unknown.png');
    //*************************************************
    //FETCH THE MESSAGES DATA FROM FIREBASE AND BUILD HTML
    //*************************************************
    //fetchMessages();
  }
}

//**********************************************************************************
//Fetch THE MESSAGES FROM FIREBASE DB, SEND THE DATA TO DISPLAY METHOD AND FINALLY
// FILTER CLASSES AND DISPLAY THE HTML
//**********************************************************************************
function fetchMessages() {
  console.log("Fetching message");
  messagesRef.child(currentChat_Id).on("child_added", snapshot => {
    //GET DATA IN JSON AND SEND IT TO DISPLAY METHOD
    var obj = snapshot.val();
    //console.log(obj);
    displayMessages(obj);
  });
}

//**********************************************************************************
//DISPLAY METHOD
//**********************************************************************************
function displayMessages(messageObj) {
  buildMessageHTML(messageObj);
  shouldScroll =
    chatContent.scrollTop + chatContent.clientHeight ===
    chatContent.scrollHeight;
  if (!shouldScroll) {
    //than scroll bottom
    chatContent.scrollTop = chatContent.scrollHeight;
  }
}

//**********************************************************************************
//METHOD TO BUILD THE MESSAGE HTML
//**********************************************************************************
function buildMessageHTML(messageObj) {
  //console.log(messageObj);
  var dir = filterDirection(messageObj.authUserId);
  //console.log(dir);
  chatContent.innerHTML += `
        <div class="message-item ${dir}" id="messageItem">
            <span class="message-time text-dark-grey text-small"><i>${new Date(
              messageObj.timestamp
            ).toLocaleString()}</i></span>
            <a href="javascript:void(0)" class="chat-img">
                <img src="${
                  messageObj.image
                    ? messageObj.image
                    : "Assets/Images/Unknown.png"
                }" 
                alt="${messageObj.name}" class="">
            </a>
            <div class="talk-bubble tri-right round right-in">
            <div class="talktext">${messageObj.message}</div>
            </div>
        </div>`;
}

//**********************************************************************************
//METHOD TO FILTER THE DIRECTION OF THE MESSAGE
//**********************************************************************************
function filterDirection(userId_d) {
  var dir = "";
  if (userId_d != authUserId) dir = "R";
  else dir = "L";
  return dir;
}

// LISTEN FOR KEYPRESS EVENT TO SEND MESSAGE

//LISTNER TO CHECK IF THE ENTER KEY IS PRESSED
inputFeild.addEventListener("keypress", function(e) {
  if (e.keyCode == 13) {
    if (inputFeild.value.trim() != "") pushData();
  }
});

//LISTNER TO CHECK IF THE SEND BUTTON IS PRESSED
document
  .getElementById("chatInput")
  .getElementsByClassName("btn-chatsend")[0]
  .addEventListener("click", function() {
    if (inputFeild.value.trim() != "") pushData();
  });

function pushData() {
  var message = inputFeild.value;
  let senderReiver_d = currentChat_Id
    .substr(currentChat_Id.indexOf(" "))
    .trim()
    .split("_");
  let receiverId =
    senderReiver_d[0] != currentAuth_Id ? senderReiver_d[0] : senderReiver_d[1];
  messagesRef.child(currentChat_Id).push({
    name: authUserName,
    message: message,
    authUserId: authUserId,
    receiverId: `${receiverId}.com`,
    timestamp: new Date().getTime(),
    image: authProfile
  });
  chatsRef.child(currentChat_Id).set({
    lastMessage: message,
    timestamp: new Date().getTime(),
    owner_Id: owner_Id,
    title: chatTitle
  });
  if (buyer_Id != "") {
    userChatsRef
      .child(buyer_Id.substr(0, buyer_Id.indexOf(".")))
      .child(currentChat_Id)
      .set(true);
    userChatsRef
      .child(owner_Id.substr(0, owner_Id.indexOf(".")))
      .child(currentChat_Id)
      .set(true);
  }
  // getReceiverTokkens(receiverId);
  inputFeild.value = "";
}
//**********************************************************************************
//METHOD TO SHOW THE CHAT ROOM
//**********************************************************************************
function showChatRoomModel() {
  // Get the modal
  var model = document.getElementById("modelDialog");
  // Get the <span> element that closes the modal
  var span = model.getElementsByClassName("model-close")[0];

  model.style.display = "block";
  // When the user clicks on <span> (x), close the model
  span.onclick = function() {
    model.style.display = "none";
  };

  chatContent.innerHTML = "";

  //AFTER REGISTERING TO THE CHAT ROOM MODEL
  //FILL THE CHAT ROOM CONTENT AND PREPARE IT

  fillChatRoomContent();
}

function fillChatRoomContent() {
  //FIRST OF ALL GET THE DATA FROM QUERY STRING
  chatTitle = getQueryStringValue("title");
  let product_Id = getQueryStringValue("product_Id");
  buyer_Id = getQueryStringValue("buy_Id");
  let buy_Id_Q = buyer_Id.substr(0, buyer_Id.indexOf("."));
  owner_Id = getQueryStringValue("email");
  let owner_Id_Q = owner_Id.substr(0, owner_Id.indexOf("."));
  let username_d = getQueryStringValue("name");
  currentChat_Id = "";
  currentChat_Id = getQueryStringValue("chat_Id");
  currentChat_Id =
    currentChat_Id != ""
      ? currentChat_Id
      : `${product_Id}${" "}${owner_Id_Q}_${buy_Id_Q}`;
  whomUNameCont.innerHTML = username_d;
  chatTitleCont.innerHTML = chatTitle;
  messagesRef.child(currentChat_Id).off();
  prepareChatRoom();
}

function getQueryStringValue(key) {
  return decodeURIComponent(
    window.location.search.replace(
      new RegExp(
        "^(?:.*[&\\?]" +
          encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") +
          "(?:\\=([^&]*))?)?.*$",
        "i"
      ),
      "$1"
    )
  );
}

//Method to fetch the msg receiver tokkens
// async function getReceiverTokkens(receiverId) {
//   console.log("getReceiverTokkens==>", receiverId);
//   // fcmTokkensRef
//   //   .orderByKey()
//   //   .equalTo(receiverId.substr(0, receiverId.indexOf(".")))
//   //   .once("value")
//   //   .then(snap => {
//   //     console.log('getReceiverTokkens==>',snap.val());
//   //   });
// }

//METHOD TO GET THE META CONTAINER IF THE MESSAGE WAS SENT BY ANY USER
//IT WILL CHANGE THE LAST MESSAGE IN THAT PARTICULAR CONTAINER ONLY
function getMessageMetaContainer(chats_Id) {
  return document.getElementById(chats_Id);
}
