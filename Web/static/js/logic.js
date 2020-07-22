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


// d3.json("./static/Data/09fm.json").then(response=>{


//     console.log(response)

// // Using geoJSON method to create markers and utilizing previously created functions to give specific colors and popups to each marker
// L.geoJSON(response).addTo(mymap);

})
