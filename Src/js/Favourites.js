function getFavourites(name) {
  let fav = localStorage[name];
  if (fav) return JSON.parse(fav);
  else null;
}

function addToFavourite(Elem) {
  console.log("addToFavourite==>", Elem);
  var isAlreadyAddedToFav = Elem.classList.contains("favourite");
  var eleId = Elem.parentNode.parentNode.id;
  var favouriteKey = JSON.parse(localStorage.getItem("userFavouriteKey"));
  // var favourites = JSON.parse(localStorage.getItem("userFavourites"));
  if (isAlreadyAddedToFav) {
    favouriteKey = favouriteKey.filter(o => o != eleId);
    //Remove it from favourites
  } else {
    //add into favourites
    favouriteKey.push(eleId);
    // if (favouriteKey.filter(o => o === eleId).length <= 0) {
    // }
  }
  if (isAlreadyAddedToFav) Elem.classList.remove("favourite");
  else Elem.classList.add("favourite");
  localStorage.setItem("userFavouriteKey", JSON.stringify(favouriteKey));
}

function hoverFavourite(Elem) {
  var isAlreadyAddedToFav = Elem.classList.contains("favourite");
  if (isAlreadyAddedToFav) {
    Elem.title = "Remove from favourites";
  } else Elem.title = "Add to your favourites for offline availability";
}

function filterFavourite(id) {
  var fav = JSON.parse(localStorage.getItem("userFavouriteKey"));
  return fav.filter(o => o === id).length > 0;
}

var arr = ["A", "B", "C", "D"];

function removeA(arr) {
  var what,
    a = arguments,
    L = a.length,
    ax;
  while (L > 1 && arr.length) {
    what = a[--L];
    while ((ax = arr.indexOf(what)) !== -1) {
      arr.splice(ax, 1);
    }
  }
  return arr;
}
