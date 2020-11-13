var authEmail;
var grid = $("#gridView")[0];
var favArray = [];
async function showFavAdsClicked() {
  if (grid.innerHTML == "") {
    authEmail = localStorage["currentAuthId"];
    if (authEmail) {
      let favourite = JSON.parse(localStorage["userFavouriteKey"]);
      for (let index = 0; index < favourite.length; index++) {
        const data = await fetchAdsById(favourite[index]);
        favArray.push(data);
        if (data) buildFavAds(data, grid, favourite[index]);
      }
    }
  }
}

//fetch the ad on the bases of id
async function fetchAdsById(id) {
  try {
    let res = await fetch(`http://localhost:5001/Ads/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    });
    return await res.json();
  } catch (err) {
    return null;
  }
}

async function sendAd(elem) {
  let id = elem.parentNode.id;
  const data = favArray.filter(o => o["_id"] == id)[0];
  localStorage.setItem("offer", JSON.stringify(data));
  // // THIS IS ABSOLUTE PATH WILL BE CHANGED TO RELATIVE WHEN DIPLOYED
  var viewAd = window.open("view_Ads.html", "_blank");
  viewAd.focus();
}

function buildFavAds(obj, grid, elemKey) {
  grid.innerHTML += `
    <div class="grid-item" id=${elemKey}>
        <div class="img" onclick="sendAd(this)"><img src="${
          obj["images"] ? obj["images"][0] : ""
        }" alt="${obj["title"]}"></div>
        <div class="matter">
            <p class="text-smaller text-dark-grey">${obj["title"]}, ${
    obj["city"]
  } ${obj["province"]}</p>
            <span class="pull-right text-red text-bold text-small">${
              obj["price"] ? "RS " + obj["price"] : ""
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
