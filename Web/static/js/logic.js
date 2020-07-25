// create variable mymap
let mymap = L.map('map').setView([19.4296549,-99.2467057], 13);


// Create the tile layer that will be the background of our map
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/light-v10',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: apiKey
}).addTo(mymap);


// Grab data with d3

url = "./static/Data/geoJSON/master_geojson.geojson"

// d3.json(url).then(response=>{

//     console.log(response)

//     // L.geoJSON(response).addTo(mymap);

// })
// var marker = L.marker([19.4296549,-99.2467057]).addTo(mymap);

  // Creates a red marker with the coffee icon
  var redMarker = L.ExtraMarkers.icon({
    icon: 'io-alarm',
    markerColor: 'red',
    shape: 'square',
    prefix: 'fa'
  });

var marker = L.marker([19.4296549,-99.2467057], {icon: redMarker}).addTo(mymap);