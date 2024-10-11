import { Loader } from '@googlemaps/js-api-loader';
import { store } from '../../../store/store';

const GOOGLE_MAPS_API_OPTIONS = {
    apiKey: 'AIzaSyD8Q7m2tEwXjBmPEZsxEPEdbcHrxd1brYM', // Replace with your actual API key
    version: 'weekly',
    libraries: ['places', 'geometry', 'marker'],
};

const GOOGLE_MAP_ID = '9b8ee480625b2419'; // Replace with your actual Map ID

class Map {
    constructor() {
        this.loader = new Loader(GOOGLE_MAPS_API_OPTIONS);
        this.markers = [];
        this.subscribeToStore();
    }

    subscribeToStore = () => {
        console.log(`123subscribeToStore was just set up`);
        store.subscribe(() => {
            console.log(`123 the store has been updated`);
            const state = store.getState();
            console.log(`state: ${state}`);
            this.updateMap(
                state.locations.mapCenter,
                state.locations.zoomLevel
            );
            this.addMarkers(state.locations.data);
        });
    };

    updateMap(center, zoom) {
        if (this.map) {
            this.map.setCenter(center);
            this.map.setZoom(zoom);
        }
    }

    init() {
        this.loader
            .load()
            .then(() => {
                console.log(
                    `foobar this.getState().locations.mapCenter: ${
                        store.getState().locations.mapCenter
                    }`
                );
                this.map = new google.maps.Map(document.getElementById('map'), {
                    center: store.getState().locations.mapCenter,
                    zoom: store.getState().locations.zoomLevel,
                    mapId: GOOGLE_MAP_ID,
                });
                console.log('Google Map has been initialized.');
            })
            .catch((e) => {
                console.error('Error loading the Google Maps API:', e);
            });
    }

    addMarkers(locations) {
        this.clearMarkers(); // Clear existing markers before adding new ones
        locations.forEach((location) => {
            const position = {
                lat: Number(location.buildingLatitude),
                lng: Number(location.buildingLongitude),
            };
            console.log('Marker position:', position);
            const marker = new google.maps.Marker({
                position,
                map: this.map,
                title: location.locationName,
            });
            this.markers.push(marker);
            console.log('Marker added:', marker);
        });
    }

    clearMarkers() {
        this.markers.forEach((marker) => marker.setMap(null));
        this.markers = [];
    }

    focusOnLocation(location) {
        const position = {
            lat: Number(location.buildingLatitude),
            lng: Number(location.buildingLongitude),
        };
        this.map.setZoom(10);
        this.map.panTo(position);
    }
}

export default Map;
