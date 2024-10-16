import { store } from '../../../store/store';
import {
    selectMapCenter,
    selectZoomLevel,
    selectMapBounds,
    setMapCenter,
    setZoomLevel,
    setMapBounds,
} from '../../../store/mapSlice.js'; // Import selectors
// import { selectLocations } from '../../../store/locationsSelectors.js';
import { debounce } from '../../../utils/debounce.js';

const GOOGLE_MAP_ID = '9b8ee480625b2419'; // Replace with your actual Map ID

import pinURL from './pin.svg';
import { updateLocation } from '../../../store/actions';

let mapPin = null;

class Map {
    constructor() {
        this.markers = [];
        this.unsubscribe = null;
        this.widget = null;
        this.current = {
            center: { lat: null, lng: null },
            zoom: null,
        };
    }

    update(center, zoom) {
        console.log(`Updating map with center: ${center.lat}, ${center.lng}`);
        if (this.widget) {
            // this.widget.setZoom(zoom);
            // this.widget.panTo(center);
        }
    }

    async init() {
        // Subscribe to the Redux store
        this.unsubscribe = store.subscribe(this.handleStoreChange);

        // Initialize the map with current state
        const state = store.getState();
        const center = selectMapCenter(state);
        const zoom = selectZoomLevel(state);
        // const bounds = selectMapBounds(state); // Get initial bounds if needed

        console.log(
            `Initializing map with center: ${center.lat}, ${center.lng} and zoom: ${zoom}`
        );
        this.widget = await new google.maps.Map(
            document.querySelector('#map'),
            {
                center: center,
                zoom: zoom,
                minZoom: zoom,
                mapId: GOOGLE_MAP_ID,
            }
        );

        this.widget.addListener('idle', () => this.updateMapLocation());

        this.widget.addListener('zoom_changed', () =>
            console.log(`zoom_changed`)
        );

        await this.loadPinMarkup();
    }

    updateMapLocation() {
        console.log(`Updating map location`);
        console.log(
            '🚀🚀🚀 ----------------------------------------------------------------------------------------🚀🚀🚀'
        );
        console.log(
            '🚀🚀🚀 ~ file: Map.js:69 ~ updateMapLocation ~ updateMapLocation🚀🚀🚀'
        );
        console.log(
            '🚀🚀🚀 ----------------------------------------------------------------------------------------🚀🚀🚀'
        );

        const zoom = this.widget.getZoom();
        const center = this.widget.getCenter();
        const bounds = this.widget.getBounds();

        store.dispatch(
            updateLocation({
                latitude: center.lat(),
                longitude: center.lng(),
                zoomLevel: zoom,
                bounds: bounds.toJSON(),
            })
        );
    }

    handleStoreChange = () => {
        const state = store.getState();
        const center = selectMapCenter(state);
        const zoom = selectZoomLevel(state);

        if (
            this.current.center.lat !== center.lat ||
            this.current.center.lng !== center.lng ||
            this.current.zoom !== zoom
        ) {
            this.current = { center, zoom };
            this.update(center, zoom);
        }
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
                map: this.widget,
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

    getAllMapWidgetSpatialData() {
        return {
            bounds: this.widget.getBounds(),
            zoom: this.widget.getZoom(),
            center: this.widget.getCenter(),
        };
    }

    focusOnLocation(location) {
        if (location) {
            console.log(`Focusing on location: ${location.locationName}`);
            const position = {
                lat: Number(location.buildingLatitude),
                lng: Number(location.buildingLongitude),
            };
            this.widget.setZoom(10);
            this.widget.panTo(position);
        }
    }

    destroy() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }
}

export default Map;
