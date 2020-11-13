var loginContainer = document.querySelector("#loginContainer");
var registerContainer = document.querySelector("#registerContainer");
var loginForm = null;
var registerForm = null;
var userObj = null;
const messaging = firebase.messaging();
messaging.usePublicVapidKey(
  "BA9gdlxFcGs_AA7yFMwEOJQ26hutJqKxq-qmxbCIf9d0LypVzGWe3k1D5lwYmX2kZ2C0ahy0wfgcJQJZyPDEXhg"
);
showLoginForm();

function showRegisterForm() {
  loginContainer.style.display = "none";
  registerContainer.style.display = "block";
}

function showLoginForm() {
  loginContainer.style.display = "block";
  registerContainer.style.display = "none";
}

function Login() {
  let form = document.querySelector("#login-form");
  let formControls = form.getElementsByClassName("form-element");
  loginForm = new FormData(form);
  var email = loginForm.get("email");
  var password = loginForm.get("password");
  var noalerts = form.getElementsByClassName("alert");
  var notValidates = form.getElementsByClassName("not-validated");
  if (!(notValidates.length > 0 || noalerts.length > 0)) {
    userObj = {
      email: email,
      password: password
    };
    LoginUsingEmailPassword(userObj)
      .then(json => {
        console.log("LoginUsingEmailPassword==>", json);
        if (json.status) window.close();
        else alert("Wrong email password");
      })
      .catch(err => {
        console.log("Error", err);
      });
  } else {
    for (let index = 0; index < formControls.length; index++) {
      filterInput(formControls[index]);
    }
  }
}

function RegisterUser() {
  let form = document.querySelector("#register-form");
  registerForm = new FormData(form);
  let formControls = form.getElementsByClassName("form-element");
  var email = registerForm.get("email");
  var password = registerForm.get("password");
  var noalerts = form.getElementsByClassName("alert");
  var notValidates = form.getElementsByClassName("not-validated");
  if (!(notValidates.length > 0 || noalerts.length > 0)) {
    userObj = {
      email: email,
      password: password
    };
    showSpinModel();
    let JSONObj = JSON.stringify(userObj);
    fetch("http://localhost:5001/signupCheck", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSONObj
    })
      .then(res => {
        return res.json();
      })
      .then(json => {
        if (json.status) {
          hideSpinModel();
          showStepTwoRegisteration();
        } else {
          hideSpinModel();
          alert("The email already exist");
        }
      })
      .catch(err => {
        hideSpinModel();
        console.log("Error!!", err);
      });
  } else {
    for (let index = 0; index < formControls.length; index++) {
      filterInput(formControls[index]);
    }
  }
}

function send_verification() {
  var user = firebase.auth().currentUser;

  user
    .sendEmailVerification()
    .then(function() {
      alert("verification sent");
    })
    .catch(function(error) {
      alert("failed to sent the email");
    });
}

function readImgUrl(input) {
  //    console.log('in read image url');
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function(e) {
      input.parentNode.style.backgroundImage = `url(${e.target.result})`;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

//open the uplod dialog
function uploadImg(element) {
  element.nextSibling.click();
}
function getUserImage(form) {
  var imgCon = form.getElementsByClassName("user-img")[0];
  return imgCon.style.backgroundImage.slice(4, -1).replace(/"/g, "");
}

function showStepTwoRegisteration() {
  var header = `<h2 class="heading text-medium text-green">Step# 2, Please fill secondary information</h2>
    <span class="model-close text-large hover-text-blue hide"><i class="fa fa-window-close"></i></span>`;
  var body = `
        <div class="form-controls">
        <input type="text" name="name" class="text-box name not-validated" 
        placeholder="Enter your name..." onblur="filterInput(this)">
        <span class="form-validate validate-img text-red">
            <img src="./Assets/Images/Warning.png" alt="alert">
        </span>
        <p class="form-validate validate-text text-red">Please enter your name</p>
        </div>
        <div class="form-controls">
        <input type="text" name="contact" class="text-box contact not-validated" 
        placeholder="Enter your contact no..." onblur="filterInput(this)">
        <span class="form-validate validate-img text-red">
            <img src="./Assets/Images/Warning.png" alt="alert">
        </span>
        <p class="form-validate validate-text text-red">Please enter your contact</p>
        </div>
        <h3 class="heading text-blue text-center">Add an image</h3>
        <div class="user-img img-container">
        <a href="javascript:void(0)" class="fas fa-plus btn-uploadimg" onclick="uploadImg(this)"></a
        ><input type="file" style="display:none" onchange="readImgUrl(this);" accept="image/gif , image/png, image/jpg, image/jpeg">
        </div>
        <div class="form-controls"><a href="javascript:void(0)" class="btn btn-login" onclick= "stepTwoRegistration()">Save Profile</a></div>`;
  showModel(header, body, false);
}

//showStepTwoRegisteration();
async function stepTwoRegistration() {
  var form = document.getElementById("stepTwoForm");
  var textBoxName = form.getElementsByClassName("name")[0];
  var userImg = form.getElementsByClassName("user-img")[0];
  var textBoxContact = form.getElementsByClassName("contact")[0];
  var notValidates = form.getElementsByClassName("alert");
  try {
    if (!(notValidates.length > 0)) {
      let image = getUserImage(form);
      showSpinModel();
      let Obj = {
        name: textBoxName.value,
        contact: textBoxContact.value,
        email: userObj.email,
        password: userObj.password,
        image: image
      };
      let JSONObj = JSON.stringify(Obj);
      const res = await fetch("http://localhost:5001/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        },
        body: JSONObj
      });
      console.log("registered with status==>", res.status);
      if (res.status === 200) {
        //=====================FOR PUSH NOTIFICATION======================
        messaging
          .requestPermission()
          .then(() => {
            return messaging.getToken();
          })
          .then(tokken => {
            //If the tokken exist than add it to db under the node of user
            console.log("current device tokken", tokken);
            if (tokken) {
              let em = Obj.email;
              console.log("email", em.substr(0, em.indexOf(".")));
              setUserTokken(em.substr(0, em.indexOf(".")), tokken);
            }
          })
          .catch(err => {
            console.log("err from .cath==>", err);
          });
        var header = `<h2 class="heading text-medium text-green">User Registered Successfully</h2>
              <span class="model-close text-large hover-text-blue"><i class="fa fa-window-close"></i></span>`;
        var body = `<p class="text-light-blue">Keep enjoying our olx service, before that please read our terms and conditions and
              OLX safety tips first carefully</p>`;
        hideSpinModel();
        showModel(header, body);
        setTimeout(() => {
          window.close();
        }, 7000);
        return onAuthStateChange({
          email: Obj.email,
          password: Obj.password
        });
      }
      userObj = null;
      return;
    }
    alert("Unable to register the user");
  } catch (err) {
    console.log(err);
  }
}

function setUserTokken(userId, tokken) {
  console.log(`setting the tokken : (${tokken}) with user : (${userId})`);
  firebase
    .database()
    .ref("/FCM_Tokken")
    .child(userId)
    .child(tokken)
    .set(true);
}

function filterInput(element) {
  if (element.name == "name") {
    if (element.value.trim() == "") {
      element.classList.add("alert");
    } else {
      element.classList.remove("alert");
    }
  } else if (element.name == "contact") {
    if (element.value.trim() == "" || !filterContact(element.value)) {
      element.classList.add("alert");
    } else {
      element.classList.remove("alert");
    }
  }
}

function filterContact(inputText) {
  var re = /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/g;
  var res = re.test(inputText);
  return res;
}

function rememberUser(element) {
  var isRemembered = element.classList.contains("rember_me");
  if (isRemembered) {
    element.classList.remove("rember_me");
  } else element.classList.add("rember_me");
}

function setCookie(name, value, path_d, days) {
  var date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 1000);
  var info = {
    expires: date.toUTCString(),
    path: path_d
  };
  cookies.set(name, JSON.stringify(value), info);
}

function getCookie(name) {
  var elem = cookies.get(name);
  return JSON.parse(elem);
}

function b64ToBlobImage(b64Data) {
  var block = b64Data.split(";");
  var contentType = block[0].split(":")[1]; // In this case "image/gif"
  // // get the real base64 content of the file
  var realData = b64Data.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
  // var blob = b64toBlob(realData, contentType);
  // var blobUrl = URL.createObjectURL(blob);
  // return blobUrl;
  var byteCharacters = atob(realData, contentType);
  var byteNumbers = new Array(byteCharacters.length);
  for (var i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  var byteArray = new Uint8Array(byteNumbers);
  // var blob = new Blob([ byteArray ], {
  // type : 'image/jpeg'
  // });
  return byteArray; //URL.createObjectURL(blob);
}

// usersRef.on('child_added',snap => {
//     let title = db.child('Titles/'+snap.key);
//     title.once('value').then(titleSnap => {
//         console.log(titleSnap.val());
//     });
// });

function validateEmail(value) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  var res = re.test(value);
  return res;
}

function showValidaters(element, validaters) {
  validaters[0].style.display = "inline-block";
  validaters[1].style.display = "block";
  element.classList.add("alert");
}

function hideValidaters(element, validaters) {
  validaters[0].style.display = "none";
  validaters[1].style.display = "none";
  element.classList.remove("alert");
}

function filterInput(element) {
  element.classList.remove("not-validated");
  let form = element.parentNode.parentNode;
  let validaters = element.parentNode.getElementsByClassName("form-validate");
  switch (element.name) {
    case "email": {
      if (element.value.trim() !== "" && validateEmail(element.value)) {
        hideValidaters(element, validaters);
      } else {
        showValidaters(element, validaters);
      }
      break;
    }
    case "contact": {
      if (element.value.trim() !== "" && filterContact(element.value.trim())) {
        hideValidaters(element, validaters);
      } else {
        showValidaters(element, validaters);
      }
      break;
    }
    case "rePassword": {
      let pas = form.getElementsByClassName("password")[0];
      if (element.value.trim() === "" || pas.value !== element.value) {
        showValidaters(element, validaters);
      } else {
        hideValidaters(element, validaters);
      }
      break;
    }
    default: {
      if (element.value.trim() !== "") {
        hideValidaters(element, validaters);
      } else {
        showValidaters(element, validaters);
      }
    }
  }
}

function filterContact(inputText) {
  var re = /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/g;
  var res = re.test(inputText);
  return res;
}
