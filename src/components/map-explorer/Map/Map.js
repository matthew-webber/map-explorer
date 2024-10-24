import { store } from '../../../store/store';
import { setMapState } from '../../../store/mapSlice.js'; 

const GOOGLE_MAP_ID = '9b8ee480625b2419'; 

import pinURL from './pin.svg';

let mapPin = null;

class Map {
    constructor(onPinClick) {
        this.markers = [];
        this.widget = null;
        this.onPinClick = onPinClick;
    }

    async init(center, zoom) {
        this.widget = await new google.maps.Map(
            document.querySelector('#map'),
            {
                center,
                zoom,
                mapId: GOOGLE_MAP_ID,
                minZoom: zoom,
            }
        );

        this.widget.addListener('idle', () => {
            this.onIdle();
        });
    }

    onIdle() {
        const center = this.widget.getCenter();
        const zoom = this.widget.getZoom();
        const bounds = this.widget.getBounds();

        store.dispatch(
            setMapState({
                mapCenter: { lat: center.lat(), lng: center.lng() },
                zoomLevel: zoom,
                mapBounds: bounds.toJSON(),
            })
        );
    }


    updateViewport({ lat, lng }, zoomLevel, mapBounds) {
        if (this.widget) {
            this.widget.setZoom(zoomLevel); // setZoom before panTo, otherwise panTo isn't smooth
            this.widget.panTo({ lat, lng });
        }
    }

    addMarkers(locations, selectedLocation) {
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
        this.markers.forEach((marker) => {
            marker.element.map = null;
        });
        this.markers = [];
    }

    highlightMarker(location) {
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

    updateMarkers(locations) {
        console.log(`asdf updateMarkers`);
        this.clearMarkers();
        this.addMarkers(locations);
    }
}

export default Map;
