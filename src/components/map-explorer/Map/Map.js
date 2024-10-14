import { store } from '../../../store/store';

const GOOGLE_MAP_ID = '9b8ee480625b2419'; // Replace with your actual Map ID

const simpleMapPin = document.createElement('svg');
simpleMapPin.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
simpleMapPin.setAttribute('viewBox', '0 0 24 24');
simpleMapPin.setAttribute('fill', 'none');
simpleMapPin.setAttribute('stroke', 'currentColor');
simpleMapPin.setAttribute('stroke-width', '2');
simpleMapPin.setAttribute('stroke-linecap', 'round');
simpleMapPin.setAttribute('stroke-linejoin', 'round');
const simpleMapPinPath = document.createElement('path');
simpleMapPinPath.setAttribute(
    'd',
    'M12 2c-3.31 0-6 2.69-6 6 0 5.25 6 14 6 14s6-8.75 6-14c0-3.31-2.69-6-6-6z'
);
simpleMapPin.appendChild(simpleMapPinPath);

class Map {
    constructor() {
        this.markers = [];
    }

    subscribeToStore = () => {
        store.subscribe(() => {
            const state = store.getState();
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

    async init() {
        this.map = await new google.maps.Map(document.getElementById('map'), {
            center: store.getState().locations.mapCenter,
            zoom: store.getState().locations.zoomLevel,
            mapId: GOOGLE_MAP_ID,
        });
        this.subscribeToStore();

        // Handle initial state
        const state = store.getState();
        this.updateMap(state.locations.mapCenter, state.locations.zoomLevel);
        this.addMarkers(state.locations.data);
    }

    addMarkers(locations) {
        this.clearMarkers(); // Clear existing markers before adding new ones
        locations.forEach((location) => {
            const position = {
                lat: Number(location.buildingLatitude),
                lng: Number(location.buildingLongitude),
            };
            const marker = new google.maps.marker.AdvancedMarkerElement({
                position,
                map: this.map,
                title: location.locationName,
                // content: simpleMapPin,
            });
            this.markers.push(marker);
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
