import { Loader } from '@googlemaps/js-api-loader';

const GOOGLE_MAPS_API_OPTIONS = {
  apiKey: 'AIzaSyD8Q7m2tEwXjBmPEZsxEPEdbcHrxd1brYM',
  version: 'weekly',
  libraries: ['places', 'geometry', 'marker'],
};

const GOOGLE_MAP_ID = '9b8ee480625b2419';

class Map {
    constructor() {
        this.loader = new Loader(GOOGLE_MAPS_API_OPTIONS);
        this.initMap();
    }

    initMap() {
        this.loader.load().then(() => {
            const mapOptions = {
                center: { lat: 32.7833, lng: -79.9320 },
                zoom: 8,
                mapId: GOOGLE_MAP_ID
            };
            this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
            console.log('Google Map has been initialized.');
        }).catch(e => {
            console.error('Error loading the Google Maps API:', e);
        });
    }

    addMarker(location) {
        const marker = new google.maps.Marker({
            position: location,
            map: this.map,
        });
    }

    clearMarkers() {
        // Assuming 'markers' is an array of marker objects
        this.markers.forEach(marker => marker.setMap(null));
        this.markers = [];
    }
}

export default Map;