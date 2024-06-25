// Defining the URL 
let earthQuakeDataURL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Initialize the Leaflet map
var map = L.map('map').setView([20, 0], 2);

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//Defining a function to get the json data from the URL
async function getEarthQuakeData(url) {
    try {
    // Fetch the data from the URL
    let response = await fetch(url);

    //Checking if the response is okay
    if (!response.ok) {
    throw new Error('The network response did not work' + response.statusText);
        }
    
    // Parse the json data
    let data = await response.json();

    //Plot the earthqauke data by calling the below function 
    plotEarthquakeData(data);
    
    // Catching the error if response in not okay
    } catch (error) {
        console.error('There is an issue with the fetch operation', error);
    }
}

// A function to get the colour based on depth

// Function to get color based on depth
function getColor(depth) {
    return depth > 90 ? '#00008B' :
           depth > 70 ? '#483D8B' :
           depth > 60 ? '#8B008B' :
           depth > 30 ? '#CD5C5C' :
           depth > 10 ? '#FD8D3C' :
           depth > -10 ? '#E9967A' :
                         '#FFE4B5';
}

// Function to plot earthquake data on the map
function plotEarthquakeData(data) {
    data.features.forEach(feature => {
        let coords = feature.geometry.coordinates;
        let lon = coords[0];
        let lat = coords[1];
        let depth = coords[2];
        let magnitude = feature.properties.mag;
        let place = feature.properties.place;

        // Create a circle marker for each earthquake
        L.circleMarker([lat, lon], {
            radius: magnitude * 2, //Scaling the marker point by magnitude
            color: getColor(depth),
            fillColor: getColor(depth),
            fillOpacity: 1.0
        }).addTo(map)
        .bindPopup(`<b>Magnitude:</b> ${magnitude}<br><b>Location:</b> ${place}`);
    });
}

// Function to create the legend
function createLegend(map) {
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [-10, 10, 30, 60, 70, 90],
            labels = [];

        div.innerHTML += '<strong>Depth (km)</strong><br>';

        // Loop through our depth intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(map);
}

//const earthquakeDataUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Fetch and plot the earthquake data
getEarthQuakeData(earthQuakeDataURL);

// Create the legend
createLegend(map);