import { store } from '../../../store/store';

const GOOGLE_MAP_ID = '9b8ee480625b2419'; // Replace with your actual Map ID

import pinURL from './pin.svg';

let simpleMapPin = null;
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

        const response = await fetch(pinURL);
        const pinText = await response.text();

        simpleMapPin = new DOMParser().parseFromString(
            pinText,
            'image/svg+xml'
        ).documentElement;

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

            const copyofsimpleMapPin = simpleMapPin.cloneNode(true);

            console.log(`copyofsimpleMapPin`, copyofsimpleMapPin);

            const marker = new google.maps.marker.AdvancedMarkerElement({
                position,
                map: this.map,
                title: location.locationName,
                content: copyofsimpleMapPin,
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
