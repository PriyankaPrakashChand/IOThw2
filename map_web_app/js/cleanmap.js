var endLocation;
var startLocation;
var map;
var routeLayer;
var directions;
var startMarker;
var endMarker = null;

map = new L.map("map", {
  layers: [new MQ.mapLayer()],
  center: [0, 0],
  zoom: 12,
});
//------------------get initial current location------------------
var currentLocationOptions = {
  enableHighAccuracy: true,
  timeout: 1000, //1second
  maximumAge: 0, // dont need cache, retrieve on the spot
};

function logCurrentPostionError(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

navigator.geolocation.getCurrentPosition(
  getCurrentLocation,
  logCurrentPostionError,
  currentLocationOptions
);

function getCurrentLocation(position) {
  window.startLocation = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
  window.startMarker = new L.marker(
    [
      startLocation.latitude,
      startLocation.longitude,
    ] /*,
    { draggable: true }*/
  );
  window.startMarker.bindPopup("You are here!");
  map.addLayer(window.startMarker);
  map.setView([window.startLocation.latitude, window.startLocation.longitude]);

  console.log("latitude= " + window.startLocation.latitude);
  console.log("longitude= " + window.startLocation.longitude);
}

//------------------jquery post location to socker server-----------------------
// function postLocation() {
//   url = "http://localhost:8089";
//   $.post(url, {
//     sLat: window.startMarker._latlng.lat,
//     slng: window.startMarker._latlng.lng,
//     elat: window.endMarker._latlng.lat,
//     elng: window.endMarker._latlng.lng,
//   });
// }

//------------------------------------------------------------------------

//  click to set destination
map.on("click", function (e) {
  var currentLocation = [e.latlng.lat, e.latlng.lng];
  // move the marker
  var notAdded = window.endMarker === null;
  if (notAdded) {
    window.endMarker = new L.marker(currentLocation);
    map.addLayer(window.endMarker);
  }
  // setdestination
  else {
    window.endMarker.setLatLng(currentLocation);
  }
  // update route
  updateRouteLayer();

  // post initial Location
  postLocation();

  // start posting change in Location
  navigator.geolocation.watchPosition(postLocation, function error(err) {
    console.warn("ERROR(" + err.code + "): " + err.message);
  });
});
//---------------calculate and show Route on map--------------------------------
function updateRouteLayer() {
  directions = MQ.routing.directions();
  directions.route({
    locations: [
      {
        latLng: {
          lat: window.startMarker._latlng.lat,
          lng: window.startMarker._latlng.lng,
        },
      },
      {
        latLng: {
          lat: window.endMarker._latlng.lat,
          lng: window.endMarker._latlng.lng,
        },
      },
    ],
  });

  routeLayer = MQ.routing.routeLayer({
    directions: directions,
    fitBounds: true,
  });
  map.addLayer(routeLayer);
}

//------------------jquery post location to socker server-----------------------
function postLocation() {
  url = "http://localhost:8089";
  $.post(url, {
    sLat: window.startMarker._latlng.lat,
    slng: window.startMarker._latlng.lng,
    elat: window.endMarker._latlng.lat,
    elng: window.endMarker._latlng.lng,
  });
}

//------------------------------------------------------------------------
// // single click to set current position
// window.startMarker.on("movend", function (e) {
//   alert(hello);
//   //   var currentLocation = [
//   //     window.startMarker.latlng.lat,
//   //     window.startMarker.latlng.lng,
//   //   ];
//   //   // move the marker
//   //   window.startMarker.setLatLng(currentLocation);
//   //   // adjust the the view
//   //   window.map.setView(currentLocation);
//   //   console.log("start moved");
//   //   // update route
//   //   updateRouteLayer();
// });
