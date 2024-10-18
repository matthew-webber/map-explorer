import { store } from '../../../store/store';
import {
    setMapCenter,
    setZoomLevel,
    setMapBounds,
} from '../../../store/mapSlice.js'; // Import selectors

const GOOGLE_MAP_ID = '9b8ee480625b2419'; // Replace with your actual Map ID

import pinURL from './pin.svg';

let mapPin = null;

class Map {
    constructor(onPinClick) {
        // Accept the onPinClick callback
        this.markers = [];
        this.widget = null;
        this.onPinClick = onPinClick; // Store the callback for later use
    }

    async init(center, zoom) {
        this.widget = await new google.maps.Map(
            document.querySelector('#map'),
            {
                center,
                zoom,
                mapId: GOOGLE_MAP_ID,
            }
        );

        // prevent idle event from firing before the map is fully loaded
        google.maps.event.addListenerOnce(this.widget, 'tilesloaded', () => {
            this.widget.addListener('idle', () => {
                this.onIdle();
            });
        });
    }

    onIdle() {
        const center = this.widget.getCenter();
        const zoom = this.widget.getZoom();
        const bounds = this.widget.getBounds();

        store.dispatch(setMapCenter({ lat: center.lat(), lng: center.lng() }));
        store.dispatch(setZoomLevel(zoom));
        store.dispatch(setMapBounds(bounds.toJSON()));
    }

    // TODO - rename -- updateMap? updateMapCenter? updateMapBounds? idk
    update({ lat, lng }, zoomLevel, mapBounds) {
        console.log(
            `Updating map to center: ${lat}, ${lng} and zoom: ${zoomLevel}`
        );
        if (this.widget) {
            this.widget.setZoom(zoomLevel); // setZoom before panTo, otherwise panTo isn't smooth
            this.widget.panTo({ lat, lng });
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
            });

            marker.addListener('click', () => {
                this.onPinClick(location);
            });

            this.markers.push({
                id: location.locationId,
                element: marker,
            });
        });
    }

    clearMarkers() {
        this.markers.forEach((marker) => marker.setMap(null));
        this.markers = [];
    }

    highlightMarker(location) {
        console.log(`Highlighting marker for location: ${location.name}`);
        this.markers.forEach((marker) => {
            if (marker.id === location.id) {
                marker.element.content.classList.add('map-pin-selected');
                marker.element.zIndex = 100;
            } else {
                marker.element.content.classList.remove('map-pin-selected');
                marker.element.zIndex = null;
            }
        });
    }
}

export default Map;
