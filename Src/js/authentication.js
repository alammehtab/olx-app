var btnAccount = document.querySelector("#myAccount");
var btnLogout = document.querySelector("#btnLogout");

(function() {
  let authUser_d = localStorage["currentAuthId"];
  if (authUser_d) {
    const user = JSON.parse(localStorage["authUser"]);
    btnAccount.innerHTML = `<i class="fas fa-user"></i> 
    ${!user.name ? authUser_d.substr(0, authUser_d.indexOf("@")) : user.name}`;
    btnLogout.style.display = "block";
    document.querySelector("#downDownMyAccount").classList.add("enable");
  } else {
    btnAccount.innerHTML = `<i class="fas fa-user"></i> My Account`;
    btnLogout.style.display = "none";
    document.querySelector("#downDownMyAccount").classList.remove("enable");
  }
})();

async function onAuthStateChange(user = null) {
  if (user != null) {
    var email = user.email;
    name = user.name ? user.name : email.substr(0, email.indexOf("@"));
    btnAccount.innerHTML = `<i class="fas fa-user"></i> ${name}`;
    btnLogout.style.display = "block";
    document.querySelector("#downDownMyAccount").classList.add("enable");
    let userFav = localStorage["userFavourites"];
    var fav_d = userFav == null ? userFav : JSON.parse(userFav);
    var favObj = null;
    if (fav_d != null && fav_d.length > 0) {
      obj = {
        favourites: fav_d,
        email: user.email
      };
    } else {
      let favKeys_d = localStorage["userFavouriteKey"];
      favKeys_d = favKeys_d == null ? favKeys_d : JSON.parse(favKeys_d);
      if (favKeys_d != null) {
        localStorage["userFavouriteKey"] = JSON.stringify([]);
      }
      obj = {
        favourites: [],
        email: user.email
      };
    }
    let JSONObj = JSON.stringify(obj);
    fetch("http://localhost:5001/Ads/Favourites", {
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
          console.log("favourites added");
        } else {
          console.log("failed to add favourites");
        }
      })
      .catch(err => {
        console.log(err);
      });
    localStorage["currentAuthId"] = user.email;
    localStorage["authUser"] = JSON.stringify(user);
    console.log("setting auth");
  } else {
    localStorage["currentAuthId"] = "";
    localStorage.removeItem("authUser");
    btnAccount.innerHTML = `<i class="fas fa-user"></i> My Account`;
    btnLogout.style.display = "none";
    document.querySelector("#downDownMyAccount").classList.remove("enable");
  }
}

async function LoginUsingEmailPassword(userObj) {
  const JSONData = JSON.stringify(userObj);
  showSpinModel();
  return fetch("http://localhost:5001/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSONData
  })
    .then(res => {
      return res.json();
    })
    .then(json => {
      hideSpinModel();
      if (json.status) {
        onAuthStateChange(json.User);
      } else {
        onAuthStateChange(null);
      }
      return json;
    })
    .catch(function(error) {
      hideSpinModel();
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log("Error: " + errorMessage);
    });
  userObj = null;
}

function getCookie(name) {
  var elem = cookies.get(name);
  return JSON.parse(elem);
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

function Logout() {
  onAuthStateChange().then(() => {
    location.reload();
  });
}

function getCookie(name) {
  var elem = cookies.get(name);
}
