// Look at activities and // https://leafletjs.com/examples/choropleth/
// Create our initial map object
// Set the longitude, latititude, and the starting zoom level
var myMap = L.map("map", {
    center: [37.0902, -95.7129],    
    zoom: 5
});
  
// Add a tile layer (the background map image) to our map
// We use the addTo method to add objects to our map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
}).addTo(myMap);
  
// Store our API endpoint inside link
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
 
// Create function for color based on magnitude size
function Color(d) {
    return d > 5 ? '#FF4500' :
            d >= 4 && d <= 5 ? '#FF8C00' :
            d >= 3 && d <= 4 ? '#FFA500' :
            d >= 2 && d <= 3 ? '#FFD700' :
            d >= 1 && d <= 2 ? '#ADFF2F' :
            d >= 0 && d <= 1 ? '#7FFF00' :
            '#fff';
}

// P
d3.json(link, function(data) {

    // Setup features 
    var features = data.features;

    // Grab the titles of the locations
    var titles = []; 
    
    features.forEach(function(d) {
    var title = d.properties.title;
    var words = title.split("of");
    titles.push(words[1]);
    });

    // Loop through each feature and add a marker using the latitude/longitude values
    for(var i = 0; i < features.length; i++) {
    
        // Function to adjust marker size from properties.mag
        function markerSize(d) {
        return d * 20000;
        } 
    
        // Add circles to the map
        L.circle([features[i].geometry.coordinates[1], features[i].geometry.coordinates[0]], {
            fillOpacity: 0.75,
            color: "#404040",
            weight: 0.5,
            // Adjust fill color - properties.mag data
            fillColor: Color(features[i].properties.mag),
            // Adjust radius - properties.mag data
            // Add pop to includ information
            radius: markerSize(features[i].properties.mag)
        }).bindPopup("<h3>" + titles[i] + "</h3><hr><h4><center>" + features[i].properties.mag + " Magnitude | MagType: " + features[i].properties.magType + "</center></h4>").addTo(myMap);
        }

// Create a legend 
// https://leafletjs.com/examples/choropleth/
var legend = L.control({position: "bottomright"});

legend.onAdd = function (map) {

var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 1, 2, 3, 4, 5],
    labels = [];
    
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' +  Color(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
    };

// Add the legend to the map
legend.addTo(myMap);
});