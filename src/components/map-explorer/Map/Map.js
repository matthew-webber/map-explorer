import { store } from '../../../store/store';
import {
    selectMapCenter,
    selectZoomLevel,
} from '../../../store/mapSelectors.js';
import { selectSelectedLocation } from '../../../store/uiSelectors.js';
import { selectLocationsList } from '../../../store/locationsSelectors.js';

const GOOGLE_MAP_ID = '9b8ee480625b2419'; // Replace with your actual Map ID

import pinURL from './pin.svg';

let mapPin = null;
class Map {
    constructor() {
        this.markers = [];
    }

    subscribeToStore = () => {
        store.subscribe(() => {
            const state = store.getState();
            const mapCenter = selectMapCenter(state);
            const zoomLevel = selectZoomLevel(state);
            const selectedLocation = selectSelectedLocation(state);
            this.updateMap(mapCenter, zoomLevel);
            this.highlightMarker(selectedLocation);
            this.focusOnLocation(selectedLocation); // Added invocation based on state
        });
    };

    updateMap(center, zoom) {
        if (this.map) {
            this.map.setCenter(center);
            this.map.setZoom(zoom);
        }
    }

    async init() {
        this.map = await new google.maps.Map(document.querySelector('#map'), {
            center: selectMapCenter(store.getState()),
            zoom: selectZoomLevel(store.getState()),
            mapId: GOOGLE_MAP_ID,
        });
        this.subscribeToStore();

        await this.loadPinMarkup();

        // Handle initial state
        const state = store.getState();
        const mapCenter = selectMapCenter(state);
        const zoomLevel = selectZoomLevel(state);
        const locations = selectLocationsList(state);
        this.updateMap(mapCenter, zoomLevel);
        this.addMarkers(locations);
    }

    async loadPinMarkup() {
        const response = await fetch(pinURL);
        const pinText = await response.text();

        mapPin = new DOMParser().parseFromString(
            pinText,
            'image/svg+xml'
        ).documentElement;
    }

    addMarkers(locations) {
        this.clearMarkers();
        const selectedLocation = selectSelectedLocation(store.getState());
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
}

export default Map;
