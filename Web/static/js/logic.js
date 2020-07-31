// Layers
let layers = {
    CITI: new L.LayerGroup(),
    BBVA: new L.LayerGroup(),
    SANTANDER: new L.LayerGroup(),
}

let mymap = L.map("map", {
    center: [19.3970079,-99.2065711],
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

let geoData = "./static/Data/master_geojson.geojson"

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
            '<b>' + 'AGEB: ' + props.ageb +
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

// Create icons for each one of our banks
let icons = {
    CITI : L.icon({
        iconUrl: './static/assets/citi.png',
        // markerColor: 'red',
        iconSize:  [28, 28],
      }),
    BBVA : L.icon({
        iconUrl: './static/assets/bbva.png',
        // markerColor: 'red',
        iconSize:  [28, 28],
      }),
    SANTANDER : L.icon({
        iconUrl: './static/assets/santander.png',
        // markerColor: 'red',
        iconSize:  [28, 28],
      }),
}

let numberBanks = L.control({
    position: "bottomleft"
});

numberBanks.onAdd = function() {
    var div = L.DomUtil.create("div", "numberBanks legend");
    return div;
};

numberBanks.addTo(mymap);

let bankJSON = "./static/Data/data.json"

d3.json(bankJSON).then(data =>{
    // console.log(data)

    let bankCount = {
        CITI: 0,
        BBVA: 0,
        SANTANDER: 0
    };

    data.forEach(d => {
        if (d.bank_name === "Banamex") {
            let newMarker = L.marker([d.lat, d.long], {icon: icons["CITI"]})
            newMarker.bindPopup("Banco: " + d.bank_name)
            newMarker.addTo(layers["CITI"])
            bankCount.CITI++
        }
        if (d.bank_name === "Santander") {
            let newMarker = L.marker([d.lat, d.long], {icon: icons["SANTANDER"]})
            newMarker.bindPopup("Banco: " + d.bank_name)
            newMarker.addTo(layers["SANTANDER"])
            bankCount.SANTANDER++
        }
        if (d.bank_name === "BBVA Bancomer") {
            let newMarker = L.marker([d.lat, d.long], {icon: icons["BBVA"]})
            newMarker.bindPopup("Banco: " + d.bank_name)
            newMarker.addTo(layers["BBVA"])
            bankCount.BBVA++
        }
        
    })
    
    // + " " + (bankCount.BBVA / (bankCount.BBVA + bankCount.SANTANDER + bankCount.CITI) *100)

    function updateLegend(data) {
        let fechaActual = new Date()
        document.querySelector(".legend").innerHTML = [
            "<p>Updated: " + fechaActual.toDateString() + "</p>",
            "<p>Número de Sucursales </p>",
            "<p> BBVA: " + bankCount.BBVA + "</p>",
            "<p> Santander: " + bankCount.SANTANDER + "</p>",
            "<p> CitiBanamex: " + bankCount.CITI + "</p>",
        ].join("");
    }
    updateLegend()
})
