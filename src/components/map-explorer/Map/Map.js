import { store } from '../../../store/store';
import { selectMapCenter, selectZoomLevel } from '../../../store/mapSlice.js'; // Import selectors
// import { selectLocations } from '../../../store/locationsSelectors.js';

const GOOGLE_MAP_ID = '9b8ee480625b2419'; // Replace with your actual Map ID

import pinURL from './pin.svg';

let mapPin = null;
class Map {
    constructor() {
        this.markers = [];
        this.unsubscribe = null; // To manage store subscription
    }

    updateMap(center, zoom) {
        console.log(`Updating map with center: ${center.lat}, ${center.lng}`);
        if (this.map) {
            console.log(`center is`, { ...center });
            this.map.setZoom(zoom);
            this.map.panTo(center);
        }
    }

    async init() {
        // Subscribe to the Redux store
        this.unsubscribe = store.subscribe(this.handleStoreChange);

        // Initialize the map with current state
        const state = store.getState();
        const center = selectMapCenter(state);
        const zoom = selectZoomLevel(state);

        console.log(
            `Initializing map with center: ${center.lat}, ${center.lng}`
        );
        this.map = await new google.maps.Map(document.querySelector('#map'), {
            center: center,
            zoom: zoom,
            minZoom: zoom,
            mapId: GOOGLE_MAP_ID,
        });
        await this.loadPinMarkup();
    }

    handleStoreChange = () => {
        const state = store.getState();
        const center = selectMapCenter(state);
        const zoom = selectZoomLevel(state);
        this.updateMap(center, zoom);
    };

    async loadPinMarkup() {
        const response = await fetch(pinURL);
        const pinText = await response.text();

        mapPin = new DOMParser().parseFromString(
            pinText,
            'image/svg+xml'
        ).documentElement;
    }

    addMarkers(locations, selectedLocation) {
        this.clearMarkers();
        locations.forEach((location) => {
            const isSelected =
                selectedLocation &&
                location.locationId === selectedLocation.locationId;
            const position = {
                lat: Number(location.buildingLatitude),
                lng: Number(location.buildingLongitude),
            };

            const copyOfMapPin = mapPin.cloneNode(true);

            // NOTE - not currently used -- for possible implementation of "selected/highlighted pins" on initial load
            if (isSelected) {
                copyOfMapPin.classList.add('selected');
            }

            const markerElement = new google.maps.marker.AdvancedMarkerElement({
                position,
                map: this.map,
                title: location.locationName,
                content: copyOfMapPin,
            });

            this.markers.push({
                id: location.locationId,
                element: markerElement,
            });
        });
    }

    clearMarkers() {
        this.markers.forEach((marker) => marker.element.setMap(null));
        this.markers = [];
    }

    highlightMarker(location) {
        if (!location) {
            console.log(`No location to highlight`);
            return;
        }

        // TODO - refactor for clustering when implementing
        this.markers.forEach((marker) => {
            if (marker.id === location.locationId) {
                marker.element.content.classList.add('selected');
                marker.element.zIndex = 100;
            } else {
                marker.element.content.classList.remove('selected');
                marker.element.zIndex = null;
            }
        });
    }

    focusOnLocation(location) {
        if (location) {
            console.log(`Focusing on location: ${location.locationName}`);
            const position = {
                lat: Number(location.buildingLatitude),
                lng: Number(location.buildingLongitude),
            };
            this.map.setZoom(10);
            this.map.panTo(position);
        }
    }

    destroy() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }
}

export default Map;
