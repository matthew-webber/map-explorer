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
        this.widget = null;
    }

    async init(center, zoom) {
        // Initialize the Google Map widget
        this.widget = await new google.maps.Map(
            document.querySelector('#map'),
            {
                center,
                zoom,
                mapId: GOOGLE_MAP_ID,
            }
        );

        this.widget.addListener('idle', () => this.onIdle());
    }

    onIdle() {
        const center = this.widget.getCenter();
        const zoom = this.widget.getZoom();
        const bounds = this.widget.getBounds();

        store.dispatch(setMapCenter({ lat: center.lat(), lng: center.lng() }));
        store.dispatch(setZoomLevel(zoom));
        store.dispatch(setMapBounds(bounds.toJSON()));

        // Dispatch actions only if necessary
        // To prevent loops, ensure these actions don't trigger `onIdle` again unnecessarily
    }

    update({ lat, lng }, zoomLevel, mapBounds) {
        console.log(
            `Updating map to center: ${lat}, ${lng} and zoom: ${zoomLevel}`
        );
        console.log(`this.widget`, this.widget);
        if (this.widget) {
            this.widget.setCenter({ lat, lng });
            this.widget.setZoom(zoomLevel);
            // const currentZoom = this.widget.getZoom();
            // console.log(
            // '🚀🚀🚀 ~ file: Map.js:57 ~ update ~ currentZoom🚀🚀🚀',
            // currentZoom
            // );
            // currentZoom < 10 && this.widget.setZoom(zoomLevel);
            // const foo = this.widget.getCenter();

            // console.log(`this.widget.getCenter()`, foo.lat(), foo.lng());
            // Optionally, apply mapBounds if needed
        }
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

            const marker = new google.maps.marker.AdvancedMarkerElement({
                position,
                map: this.widget,
                title: location.locationName,
                // Add additional marker configuration here
            });

            if (isSelected) {
                marker.setIcon('selected-icon-url'); // Customize as needed
            }

            this.markers.push(marker);
        });
    }

    clearMarkers() {
        this.markers.forEach((marker) => marker.setMap(null));
        this.markers = [];
    }
}

export default Map;
