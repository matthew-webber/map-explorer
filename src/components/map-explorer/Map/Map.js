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
        // this.initMap();
    }

    init(lat = 32.7833, lng = -79.932, zoom = 7) {
        const foo = { center: { lat, lng }, zoom, mapId: GOOGLE_MAP_ID };
        console.log(`FOO FOO FOO: ${JSON.stringify(foo)}`);
        this.loader
            .load()
            .then(() => {
                this.map = new google.maps.Map(
                    document.getElementById('map'),
                    // {
                    // ...mapOptions,
                    // mapId: GOOGLE_MAP_ID,
                    // }
                    foo
                );
                console.log('Google Map has been initialized.');
            })
            .catch((e) => {
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
        this.markers.forEach((marker) => marker.setMap(null));
        this.markers = [];
    }
}

export default Map;
