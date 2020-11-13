//shorcuts to important controls and objects
const db = firebase.database();
const rootRef = db.ref();
var filteredData = [];
var finalFilteredData = [];
var grid = document.getElementById("gridView");
var gridContainer = document.getElementById("gridContainer");
var cmbLocation = document.getElementById("cmbLocation");
var cmbCategory = document.getElementById("cmbCategory");
var searchTextBox = document.getElementById("textboxSearchText");

//filter the data from db as either query based or simple
async function getData() {
  let queryEnabled = false;
  const category =
    cmbCategory.selectedIndex > 0
      ? cmbCategory.options[cmbCategory.selectedIndex].value
      : "";
  const location =
    cmbLocation.selectedIndex > 0
      ? cmbLocation.options[cmbLocation.selectedIndex].value
      : "";
  const searchText = searchTextBox.value;
  console.log("getData");
  console.log("location==>", category);
  console.log("searchText==>", category);
  console.log("category==>", category);
  console.log(
    "location || searchText || category==>",
    location || searchText || category ? true : false
  );
  if (location || searchText || category) queryEnabled = true;
  try {
    const data = await fetchData(category, location, searchText, queryEnabled);
    console.log("data==>", data);
    displayData(data);
  } catch (err) {
    console.log(err);
  }
}

//feth the data from db either it is query based or not
async function fetchData(category, location, search, queryParam) {
  let endPoint = "http://localhost:5001/Ads/";
  let query =
    `?${location ? "location=" + location : ""}` +
    `${search ? "&search=" + search : ""}` +
    "&query=true" +
    `${category ? "&category=" + category : ""}`;
  endPoint += queryParam ? query : "All";
  try {
    console.log("fetching data for ==>", `${endPoint.trim()}`);
    let data = await fetch(endPoint.trim(), {
      method: "GET"
    });
    let json = await data.json();
    return json;
  } catch (err) {
    console.log("Error fetching data", err);
  }
}

async function displayData(objArray) {
  finalFilteredData = [];
  finalFilteredData = await objArray;
  hideSpinModel();
  gridContainer.innerHTML = "";
  grid.style.display = "grid";
  grid.innerHTML = "";
  if (finalFilteredData.length > 0) {
    for (let i = 0; i < finalFilteredData.length; i++) {
      appdenDataInHTML(finalFilteredData[i], grid);
    }
  }
}

function appdenDataInHTML(obj, grid) {
  console.log('appdenDataInHTML=>',obj)
  grid.innerHTML += `
    <div class="grid-item" id='${obj["_id"]}'>
        <div class="img" onclick="sendAd(this)"><img src="${
          obj["images"] ? obj["images"][0] : ""
        }" alt="${obj["title"]}"></div>
        <div class="matter">
            <p class="text-smaller text-dark-grey">${obj["title"]}, ${
    obj["city"]
  } ${obj["province"]}</p>
            <span class="pull-right text-red text-bold text-small">${
              obj["Price"] ? "RS " + obj["Price"] : ""
            }</span>
            <div class="addToFavourite-tag text-large text-dark-grey ${
              filterFavourite(obj._id) ? "favourite" : ""
            }"
            data-toggle="tooltip" data-placement="top" 
            title="Add to your favourites for offline availability" id="${
              obj._id
            }" 
            style="display: inline-block" onclick="addToFavourite(this)" onmouseover="hoverFavourite(this)"><i class="fas fa-heart"></i></div>
        </div>
    </div>
    `;
}

function objIsEmpty(obj) {
  for (var prop in obj) {
    return false;
  }
  return true;
}

function changeCmbCategoryIndex(cmbContainer) {
  //console.log(cmbContainer.firstChild.nextSibling.innerHTML);
  var id = cmbContainer.id;
  cmbCategory.value = cmbCategory.options[id].value;
  // console.log(cmbCategory.value);
  cmbCategory.onchange();
}

function sendAd(element) {
  localStorage["offer"] = JSON.stringify(
    finalFilteredData[element.parentNode.id]
  );
  //window.location.href = "view_Ads.html";
  var viewAd = window.open(location.origin + "/view_Ads.html", "ad offer");
  viewAd.focus();
}
