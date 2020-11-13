//INSTALL ( INSTALL THE SERVICE WOKRER AND ADD THE STATIC CONTENTS INTO CACHE )
//ACTIVATE ( UPDATE NEW CACHE AND THE DELETE THE OLD ONE )
// FETCH ( DEFINE FROM WHERE TO FETCH THE DATA, FROM CACHE OR FROM SERVER )

const staticAssets = [
  "/",
  "index.html",
  "answers.html",
  "view_Ads.html" /* HTML FILES */,
  "css/answers.css",
  "css/bootstrap.css",
  "css/commonStyle.css",
  "css/indexStyle.css",
  "css/model.css",
  "css/fontawesome.css",
  "css/iziToast.min.css",
  "css/view_Ads.css" /*CSS FILES*/,
  "js/bootstrap.min.js",
  "js/fontawesome.js",
  "js/chatRoom.js",
  "js/chatsMeta.js",
  "js/Favourites.js",
  "js/filterAds.js",
  "js/filterFavAds.js",
  "js/filterFavAds.js",
  "js/jaaulde-cookies.js",
  "js/jquery.min.js",
  "js/model.js",
  "js/tether.min.js",
  "js/iziToast.min.js",
  "js/view_Ads.js" /*JS FILES*/,
  "Assets/Images/empty_img.jpg",
  "Assets/Images/footer-back.png",
  "Assets/Images/Olx logo.svg",
  "Assets/Images/search-background.png" /*IMAGE FILES*/,
  /*Manifest*/
  "manifest.json",
  /*Fonts*/
  "Assets/Fonts",
  /*PUSH MSG JS*/
  "pushMsg.js"
];

var staticCache = "v1";
var dynamicCache = "v1-dynamic";

//EVENT TO INSTALL THE SERVICE WORKER
self.addEventListener("install", event => {
  console.log("[ Servicer Worker ] Installing");
  self.skipWaiting();
  event.waitUntil(
    caches.open(staticCache).then(res => {
      console.log("wait.........!");
      return res.addAll(staticAssets);
    })
  );
  console.log("[ Servicer Worker ] Installed");
});

//EVENT TO UPDATE THE CACHE AND DELETE THE OLD ONE
self.addEventListener("activate", event => {
  console.log("[ Servicer Worker ] Activate");
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key != staticCache && key != dynamicCache) {
            console.log("[ServiceWorker] Removing old cache", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// EVENT TO FETCH THE DATA FROM SERVICE WORKER OR SERVER
self.addEventListener("fetch", event => {
  console.log("[ Servicer Worker ] Fetch", event.request.url, event.request);
  const req = event.request;
  const url = new URL(req.url);
  if (url.origin == location.origin) {
    return event.respondWith(cacheFirst(req));
  }
  //PROBLEM IN DYNAMIC CACHING IN MESSAGING
  // else if(){}
  return event.respondWith(networkFirst(req));
});

async function cacheFirst(req) {
  return caches
    .match(req) // if we have not written a return statement this will not work
    .then(cacheRes => {
      return cacheRes || fetch(req);
    })
    .catch(err => {
      console.log(err);
      return;
    });
}

async function networkFirst(req) {
  const url = new URL(req.url);
  if (url.href.startsWith("http://localhost:5001/Ads") && req.method == "GET") {
    const dynamicCache = await caches.open("v1-dynamic");
    try {
      const networkResponse = await fetch(req);
      dynamicCache.put(req, networkResponse.clone());
      return networkResponse;
    } catch (err) {
      const cacheResponse = await caches.match(req);
      return cacheResponse;
    }
  }
  return fetch(req);
}
