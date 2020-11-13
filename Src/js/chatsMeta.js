var currentAuth_Id = "";
var currentAuth_Email = "";
var chatsMetaListCont = $("#chatsMetaList")[0];
var clickedChatItem = null;

//***************************************************
//FIRST OF ALL WE NEED TO AUTHENTICATE THE USER
//THEN ONLY WE CAN DISPLAY ITS CHATS
//***************************************************

var authCall = (function() {
  var authUser_d = localStorage["currentAuthId"];
  if (!authUser_d) {
    var authPopWindow = window.open(
      "Authentication.html",
      "Please Login First",
      `height=${screen.height},width=${screen.width}`
    );
    if (authPopWindow == null)
      alert(
        "Please change your popup settings, May be your browser is blocking the popups"
      );
    else {
      authPopWindow.focus();
    }
  } else {
    filterQueryString();
    currentAuth_Email = authUser_d;
    currentAuth_Id = currentAuth_Email.substr(
      0,
      currentAuth_Email.indexOf(".")
    );
    fetchChatsMeta(currentAuth_Id);
  }
})();

function fetchChatsMeta(User_Id) {
  userChatsRef.child(User_Id).on("child_added", snap => {
    var key = snap.key;
    chatsRef.child(key).on("value", snap => {
      // console.log(snap.val(),snap.key);
      displayChatsMeta(snap.val(), snap.key);
    });
  });
}

async function displayChatsMeta(Chatsobj, chats_Id) {
  //FIRST OF ALL GET THE OWNER PROFILE PIC AND NAME
  let user_Id = Chatsobj.owner_Id;
  //   var query = usersRef.orderByChild("email").equalTo(user_Id);
  //   let usersSnap = await query.once("value");
  //   let usersProfile = usersSnap.val();
  try{
    let res = await fetch(`http://localhost:5001/signin/${user_Id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  })
  let userJson_d = await res.json();
   buildChatsHTML(Chatsobj, chats_Id, userJson_d);
  }
  catch(err){

  }
}

function buildChatsHTML(chatsObj, chats_Id, userSnap) {
  var usersProfile;
  for (const key in userSnap) {
    usersProfile = userSnap[key];
  }
  // console.log('Users Data',usersProfile);
  // console.log('chats Data',chatsObj);
  var item = document.getElementById(chats_Id);
  var clickedChatItem = item ? item : null;
  if (clickedChatItem == null)
    chatsMetaListCont.innerHTML += `
<li class="chat-item" onclick = "chatItemClicked(this)" id='${chats_Id}'>
    <div class="container">
        <div class="row">
            <div class="col-md-2 col-sm-2 img-container">
                <img src='${
                  usersProfile.image
                    ? usersProfile.image
                    : "Assets/Images/Unknown.png"
                }' alt="${chatsObj.title}" class="chat-img">
                <img src="Assets/Images/Olx logo.svg" alt="user-img" class="user-img">
            </div>
            <div class="col-md-10 col-sm-10 content-container">
                <h6 class="user-name text-bold" id="userName">${
                  usersProfile.name
                }</h6>
                <p class="chat-title text-bold text-small text-dark-grey">${
                  chatsObj.title
                }</p>
                <p class="last-message text-dark-grey text-small" id="lastMessage"><i>${
                  chatsObj.lastMessage
                }</i></p>
                <span class="chat-time text-small text-dark-grey"><i>${new Date(
                  chatsObj.timestamp
                ).toLocaleString()}</i></span>
                <input type="hidden" value="${
                  chatsObj.owner_Id
                }" class="owner-Email">
            </div>
        </div>
    </div>
</li>`;
  else
    clickedChatItem.innerHTML = `<div class="container">
        <div class="row">
            <div class="col-md-2 img-container">
                <img src='${
                  usersProfile.image != null
                    ? usersProfile.image
                    : "Assets/Images/Unknown.png"
                }' alt="${chatsObj.title}" class="chat-img">
                <img src="Assets/Images/Olx logo.svg" alt="user-img" class="user-img">
            </div>
            <div class="col-md-10 content-container">
                <h6 class="user-name text-bold" id="userName">${
                  usersProfile.name
                }</h6>
                <p class="chat-title text-bold text-small text-dark-grey">${
                  chatsObj.title
                }</p>
                <p class="last-message text-dark-grey text-small" id="lastMessage"><i>${
                  chatsObj.lastMessage
                }</i></p>
                <span class="chat-time text-small text-dark-grey"><i>${new Date(
                  chatsObj.timestamp
                ).toLocaleString()}</i></span>
                <input type="hidden" value="${
                  chatsObj.owner_Id
                }" class="owner-Email">
            </div>
        </div>
    </div>
    `;
}

function chatItemClicked(chatItem) {
  // if(lastItemClicked)
  // lastItemClicked.classList.remove('item-shown');
  var title_d = chatItem.getElementsByClassName("chat-title")[0];
  var uName_d = chatItem.getElementsByClassName("user-name")[0];
  var ownerEmail_d = chatItem.getElementsByClassName("owner-Email")[0];

  //APPEND THE ABOVE RECEIVED DATA IN QUERY STRING
  window.history.replaceState(
    {},
    "",
    window.location.pathname +
      `?title=${title_d.innerHTML}&name=${uName_d.innerHTML}&email=${
        ownerEmail_d.value
      }&chat_Id=${chatItem.id}`
  );
  showChatRoomModel();
  //filterQueryString();
}

//******************************************
//CHECKS IF THE DATA IS ALREADY SENT FROM ANOTHER PAGE
//******************************************
function filterQueryString() {
  if (window.location.search) {
    showChatRoomModel();
  }
}
