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

let geoData = "./static/Data/geoJSON/master_geojson (1).geojson"


// Grab data with D#
d3.json(geoData).then(data=>{

// control that shows state info on hover
    let info = L.control()

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
    };
    
    info.update = function (props) {
        this._div.innerHTML = '<h4>Manzanas de Miguel Hidalgo</h4>' +  (props ?
            '<b>' + 'Número de manzana: ' + props.mza + '</b><br />' + 'Poblacion de ' + props.pobtot + ' habitantes'
            : 'Coloca el cursor sobre una manzana');
    };
    
    info.addTo(mymap);

// get color depending on population density value
    function getColor(data) {
        return     data > 500  ? '#08589e' :
                   data > 200  ? '#2b8cbe' :
                   data > 100  ? '#4eb3d3' :
                   data > 50   ? '#7bccc4' :
                   data > 20   ? '#a8ddb5' :
                   data > 10   ? '#ccebc5' :
                              '#f0f9e8';
        }


function style(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: getColor(feature.properties.pobtot)
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
        click: zoomToFeature
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
        grades = [0, 10, 20, 50, 100, 200, 500],
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

// // let marker = L.marker([19.4296549,-99.2467057]).addTo(mymap);

// //   Creates a red marker with the coffee icon
//   let redMarker = L.ExtraMarkers.icon({
//     icon: 'ion-android-bicycle',
//     markerColor: 'red',
//     shape: 'square',
//     prefix: 'fa'
//   });

// let marker = L.marker([19.4296549,-99.2467057], {icon: redMarker}).addTo(mymap);

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