// Shorcuts to important containers
var offerHeading = document.getElementById("offerHeading");
var bigImage = document.getElementById("bigImage");
var imageGallery = document.getElementById("imageGallery");
var primaryDetails = document
  .getElementById("primaryDetails")
  .getElementsByTagName("ul")[0];
var secondaryDetails = document.getElementById("secondaryDetails");
var offerAction = document.getElementById("offerAction");
var priceTag = offerAction.getElementsByClassName("price-tag")[0];
var userData = offerAction.getElementsByClassName("user-data")[0];
var contact = offerAction.getElementsByClassName("contact")[0];
// // // // // // // // // // // // // // // // // // // //

window.addEventListener("load", displayOffer);

//console.log(JSON.parse(localStorage["offer"]));

// var dbRef = firebase.database().ref();

// dbRef.child('Ads/Mobiles').once('value')
// .then(snapshot => {
//     for (const key in snapshot.val()) {
//         console.log(snapshot.val()[key]);
//     }
// });

var photobarImages = document
  .getElementById("imageGallery")
  .getElementsByTagName("li");
var imageNumber = 0;

function activeOpacity(element) {
  var activedContainer = document.getElementsByClassName("active")[0];
  activedContainer.classList.remove("active");
  element.classList.add("active");
}

function displayBigImage(element) {
  var bigImageContainer = document
    .getElementById("bigImage")
    .getElementsByClassName("img")[0].firstChild;
  var btnShowOnlyImage = document.getElementById("showImageOnly");
  var photobarImg = element.firstChild;

  if (bigImageContainer.src != photobarImg.src) {
    bigImageContainer.src = photobarImg.src;
    btnShowOnlyImage.href = photobarImg.src;
  }
  activeOpacity(element);
}

function navigateNextImage() {
  imageNumber++;
  if (imageNumber == photobarImages.length) imageNumber = 0;
  photobarImages[imageNumber].click();
}

function navigatePreviousImage() {
  if (imageNumber == 0) imageNumber = photobarImages.length;
  imageNumber--;
  photobarImages[imageNumber].click();
}

function displayOffer() {
  var obj = JSON.parse(localStorage["offer"]);
  if (!objIsEmpty(obj)) {
    console.log(obj);
    buildHTML(obj);
  } else {
    console.log(obj, "object is empty");
  }
  // buildHTML(obj);
}

function buildHTML(obj) {
  //HTML for offer heading
  offerHeading.innerHTML = `
        <h3 class="heading" id="productTitle">${obj["title"]}</h3>
        <p class="location-info">
        <span class="loc"><i class="fas fa-map-marker-alt text-red"></i> ${
          obj["city"]
        }, ${["province"]}</span>
        <span class="date"> &nbsp;Added on ${new Date(
          obj["timestamp"]
        ).toLocaleDateString()}</span>
        </p>`;
  // // // // // // // // // //

  //HTML for bigImage
  bigImage.innerHTML = `
        <a class="btn-left" onclick="navigatePreviousImage()"><i class="fas fa-chevron-left text-dark-grey text-larger"></i></a>
        <a class="btn-right" onclick="navigateNextImage()"><i class="fas fa-chevron-right text-dark-grey text-larger"></i></a>
        <a target="_blank" href="${
          obj["images"].length > 0
            ? obj["images"][0]
            : "../Assets/Images/empty_img.jpg"
        }" id="showImageOnly" class="btn-fullimg"><i class="fas fa-compress text-light-grey"></i></a>
        <div class="img"><img src="${
          obj["images"].length > 0
            ? obj["images"][0]
            : "../Assets/Images/empty_img.jpg"
        }" alt="${obj["title"]}"></div>
    `;
  // // // // // // // // // //

  //HTML for imageGallery
  if (obj["images"].length > 0) {
    imageGallery.innerHTML = `
        <li class="active" onclick="displayBigImage(this)"><img src="${
          obj["images"][0]
        }" alt="bar_img1"></li>`;
    for (let i = 1; i < obj["images"].length; i++) {
      imageGallery.innerHTML += `
            <li  onclick="displayBigImage(this)"><img src="${
              obj["images"][i]
            }" alt="bar_img${i + 1}"></li>
            `;
    }
  } else imageGallery.style.display = "none";
  // // // // // // // // // //

  //HTML for primaryDetails
  primaryDetails.innerHTML = "";
  if (obj["Condition"]) {
    primaryDetails.innerHTML += `
        <li>
            <span class="text-bold text-blue">Condtion</span>
            <p>${obj["Condition"]}</p>
        </li>
        `;
  } else if (obj["type"]) {
    primaryDetails.innerHTML += `
        <li>
            <span class="text-bold text-blue">Type</span>
            <p>${obj["type"]}</p>
        </li>`;
  }
  // // // // // // // // // //

  //HTML for secondaryDetails
  secondaryDetails.innerHTML = `
        <p>${obj["description"].replace(/(?:\r\n|\r|\n)/g, "<br>")}</p>`;
  // // // // // // // // // //

  //HTML for priceTage
  priceTag.innerHTML = `Rs ${obj["price"]}`;
  // // // // // // // // // //

  //HTML for userData
  userData.innerHTML = `
        <h5 class="text-bold" id="ownerName">${obj["owner"]}</h5>
        <p>${obj["city"]}, ${obj["province"]}</p>
        <p class="related-ads"><a href="#">Related Ads</a></p>`;
  // // // // // // // // // //

  //HTML for contact
  var chatOption = ``;
  if (obj["ownerEmail"] && obj["ownerEmail"] != "") {
    //check if the owner has an email than enable chat option
    //console.log(obj["email"]);
    chatOption = `
        <p class="chat-now tool-tip"
        ><a href ="javascript:void(0)" class="text-bold" id="${
          obj["ownerEmail"]
        }" onclick="chatNowClicked(this)">Chat Now</a>
        <span class="tool-tip-text tool-tip-auto">The owner of the product is not the user of OLX,
        you can contact him/her via contact number
        </span>
        </p>`;
  }

  contact.innerHTML = `
        <p class=""><strong>Call At: </strong>${obj["phone"]}</p>${chatOption}`;
  // // // // // // // // // //
}

function showToolTipChat(Time) {
  var toolTip = contact.getElementsByClassName("tool-tip-auto")[0];
  toolTip.classList.add("show");
  setTimeout(() => {
    toolTip.classList.remove("show");
  }, Time);
}

function objIsEmpty(obj) {
  for (var prop in obj) {
    return false;
  }
  return true;
}

function sendQueryString(
  baseUrl,
  product_Id,
  productTitle,
  ownerName,
  ownerEmail,
  buy_Id
) {
  let url = `${baseUrl}?product_Id=${product_Id}&title=${productTitle}&name=${ownerName}&email=${ownerEmail}&buy_Id=${buy_Id}`;
  window.location.href = url;
  // window.history.replaceState({},"",window.location.pathname+`?title=${productTitle}&name=${ownerName}&email=${ownerEmail}`);
}

async function IsUserExists(email) {
  try {
    let res = await fetch(`http://localhost:5001/signin/${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    });
    let json = await res.json();
    return json.length > 0;
  } catch (err) {
    console.log(err);
  }
}

async function chatNowClicked(element) {
  //console.log(window.location.href);
  showSpinModel();
  let userExits = await IsUserExists(element.id);
  hideSpinModel();
  if (userExits) {
    let user = localStorage["currentAuthId"];
    if (user) {
      let productobj = JSON.parse(localStorage["offer"]);
      let product_Id = productobj._id;
      let productTitle = document.getElementById("productTitle").innerHTML;
      let ownerName = document.getElementById("ownerName").innerHTML;
      let ownerEmail = productobj.ownerEmail;
      let locationOrigin = location.origin;
      if (user != ownerEmail) {
        let buy_Id = user;
        let baseUrl = locationOrigin+"/answers.html"; 
        // .ORIGING IS NOT RUNNING 
        // THIS TIME CHANGE IT LATER
        sendQueryString(
          baseUrl,
          product_Id,
          productTitle,
          ownerName,
          ownerEmail,
          buy_Id
        );
      } else {
        window.location.href = locationOrigin + "/answers.html";
      }
    } else {
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
    }
  } else {
    showToolTipChat(6000);
  }
}
