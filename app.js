let map;
let markers = [];

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
    });
}

function addMarker(location) {
    const marker = new google.maps.Marker({
        position: location,
        map: map,
    });
    markers.push(marker);
}

function clearMarkers() {
    for (let marker of markers) {
        marker.setMap(null);
    }
    markers = [];
}

document.getElementById('search-btn').addEventListener('click', function() {
    const address = document.getElementById('search-input').value;
    const zoomLevel = parseInt(document.getElementById('zoom-level').value, 10);
    // Here you would typically use the Google Geocoding API to resolve the address to coordinates
    // For now, we'll simulate this
    console.log(`Search for ${address} with zoom level ${zoomLevel}`);
});

window.initMap = initMap;