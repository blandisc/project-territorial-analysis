// create variable mymap
// let mymap = L.map('map').setView([19.4296549,-99.2467057], 13);

// Layers
let layers = {
    CITI: new L.LayerGroup(),
    BBVA: new L.LayerGroup(),
    SANTANDER: new L.LayerGroup(),
}

var mymap = L.map("map", {
    center: [19.4296549,-99.2467057],
    zoom: 13,
    layers: [
      layers.CITI,
      layers.BBVA,
      layers.SANTANDER,
    ]
  });

// Create the tile layer that will be the background of our map
let lightmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/light-v10',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: apiKey
}).addTo(mymap);

let geoData = "./static/Data/geoJSON/master_geojson (1).geojson"

// Grab data with D3 - Manzanas
d3.json(geoData).then(data=>{

// control that shows state info on hover
    let info = L.control()

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
    };
    
    info.update = function (props) {
        this._div.innerHTML =   (props ?
            '<h4>Manzanas de ' + props.nom_mun + '</h4>' +
            '<b>' + 'Número de AGEB: ' + props.ageb +
            '<br />' +
            'MZA: '+ props.mza + '</b>' +
            '<br />' + 
            'Poblacion de ' + props.pobtot + ' habitantes'
            + '<br />' + 'Puntuación: ' + props.score
            : 'Coloca el cursor sobre una manzana');
    };
    
    info.addTo(mymap);

// get color depending on population density value
    function getColor(data) {
        return     data > 9  ? '#08589e' :
                   data > 8  ? '#2b8cbe' :
                   data > 7  ? '#4eb3d3' :
                   data > 6   ? '#7bccc4' :
                   data > 5   ? '#a8ddb5' :
                   data > 4   ? '#ccebc5' :
                              '#f7fcf0';
        }


function style(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: getColor(feature.properties.score)
    };
}


function highlightFeature(e) {
    let layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

let geojson;

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    mymap.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        // click: zoomToFeature
    });
}

geojson = L.geoJson(data, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(mymap);

mymap.attributionControl.addAttribution('Datos de Poblacion &copy; <a href="http://inegi.gov/">INEGI Censo 2010</a>');

let legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    let div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 4, 5, 6, 7, 8, 9],
        labels = [],
        from, to;

    for (let i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
            '<i style="background:' + getColor(from + 1) + '"></i> ' +
            from + (to ? '&ndash;' + to : '+'));
    }

    div.innerHTML = labels.join('<br>');
    return div;
};

    legend.addTo(mymap);

})

// Add our 'lightmap' tile layer to the map
lightmap.addTo(mymap);


// Create an overlays object to add to the layer control
let overlays = {
    "Citi Banamex": layers.CITI,
    "BBVA": layers.BBVA,
    "Santander": layers.SANTANDER,
  };

// Create a control for our layers, add our overlay layers to it
L.control.layers(null, overlays).addTo(mymap);


let icons = {
    CITI : L.icon({
        iconUrl: './static/assets/citi.png',
        markerColor: 'red',
        iconSize:  [28, 28],
      }),
    BBVA : L.icon({
        iconUrl: './static/assets/bbva.png',
        markerColor: 'red',
        iconSize:  [28, 28],
      }),
    SANTANDER : L.icon({
        iconUrl: './static/assets/santander.png',
        markerColor: 'red',
        iconSize:  [28, 28],
      }),
}


// urlINEGI = "https://www.inegi.org.mx/app/api/denue/v1/consulta/BuscarAreaAct/09/016/0/0/0/0/0/0/522110/0/1/0/ac054ffa-9a27-4200-9e5e-91b6c292b82d"

// d3.csv("").then(data =>{

// let bank = xxxxxx


// var banksCount = {
//     CITI: 0,
//     BBVA: 0,
//     SANTANDER: 0
//   };

//   // Initialize a stationStatusCode, which will be used as a key to access the appropriate layers, icons, and station count for layer group
// //   var stationStatusCode;

//   // Loop through the stations (they're the same size and have partially matching data)
//   for (var i = 0; i < stationInfo.length; i++) {

//     // Create a new station object with properties of both station objects
//     var station = Object.assign({}, stationInfo[i], stationStatus[i]);
//     // If a station is listed but not installed, it's coming soon
//     if (!station.is_installed) {
//       stationStatusCode = "COMING_SOON";
//     }
//     // If a station has no bikes available, it's empty
//     else if (!station.num_bikes_available) {
//       stationStatusCode = "EMPTY";
//     }
//     // If a station is installed but isn't renting, it's out of order
//     else if (station.is_installed && !station.is_renting) {
//       stationStatusCode = "OUT_OF_ORDER";
//     }
//     // If a station has less than 5 bikes, it's status is low
//     else if (station.num_bikes_available < 5) {
//       stationStatusCode = "LOW";
//     }
//     // Otherwise the station is normal
//     else {
//       stationStatusCode = "NORMAL";
//     }

//     // Update the station count
//     stationCount[stationStatusCode]++;
//     // Create a new marker with the appropriate icon and coordinates
//     var newMarker = L.marker([station.lat, station.lon], {
//       icon: icons[stationStatusCode]
//     });

//     // Add the new marker to the appropriate layer
//     newMarker.addTo(layers[stationStatusCode]);

//     // Bind a popup to the marker that will  display on click. This will be rendered as HTML
//     newMarker.bindPopup(station.name + "<br> Banco: " + station.capacity + "<br>");
//   }

//   // Call the updateLegend function, which will... update the legend!
//   updateLegend(updatedAt, stationCount);
// });

// let marker = L.marker([19.4296549,-99.2467057]).addTo(mymap);

//   Creates a red marker with the coffee icon
//   let redMarker = L.ExtraMarkers.icon({
//     icon: 'ion-cash',
//     markerColor: 'red',
//     shape: 'square',
//     prefix: 'fa'
//   });

let CITI = L.icon({
    iconUrl: './static/assets/santander.png',
    markerColor: 'red',
    iconSize:  [28, 28],
  })

let marker = L.marker([19.4296549,-99.2467057], {icon: CITI}).addTo(mymap);


// Alternative way (only inserts markers)
// d3.json(url).then(response=>{
    
//     let earthquakes = response.features
    
//     let earthquakeMarkers = []

//     for (let i = 0; i < earthquakes.length; i++) {
        
//         let earthquake = earthquakes[i]

//         // console.log(earthquake[index])

//        let earthquakeMarker = L.marker([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]])
//                                 .bindPopup("<h3>Name: <h3>" + earthquake.properties.name + "<h3> Magnitude: </h3>" + earthquake.properties.mag).addTo(mymap)
//                                 .addTo(mymap)

//         earthquakeMarkers.push(earthquakeMarker)

//     }

//     // console.log(earthquakeMarkers)
// })