import { store } from '../../store/store.js';
import Map from './Map/Map.js';
import SearchBar from './SearchBar/SearchBar.js';
import Filter from './Filter/Filter.js';
import LocationList from './LocationList/LocationList.js';
import { Loader } from '@googlemaps/js-api-loader';
import { setLocations, selectLocations } from '../../store/locationsSlice.js';
import {
    setMapCenter,
    selectMapCenter,
    selectZoomLevel,
    selectMapBounds,
} from '../../store/mapSlice.js';
import {
    setSelectedLocation,
    selectSelectedLocation,
} from '../../store/uiSlice.js';
import { updateLocation } from '../../store/actions.js';

const GOOGLE_MAPS_API_OPTIONS = {
    apiKey: 'AIzaSyD8Q7m2tEwXjBmPEZsxEPEdbcHrxd1brYM', // Replace with your actual API key
    version: 'weekly',
    libraries: ['places', 'geometry', 'marker'],
};

const MIN_ZOOM_LEVEL_ON_LOCATION_SELECT = 10;

class MapExplorer {
    constructor() {
        this.map = new Map();
        this.searchBar = new SearchBar();
        this.filter = new Filter();
        this.locationList = new LocationList();
        this.state = store.getState();
    }

    subscribeToStore = () => {
        store.subscribe(() => {
            const newState = store.getState();
            this.handleStateChange(this.state, newState);
            this.state = newState;
        });
    };

    handleStateChange = (prevState, newState) => {
        console.log(`🤔: handling state change?`);
        /*
        if the selected location changed,
            update the map pin's classList associated with the selected location to include '.map-pin.selected
            update the map's...
                center to have the selected location's latitude and longitude
                zoom level to 10 (unless the current zoom level is >= 10)
        if the map bounds changed,
            tell the location list to update its list of locations
        if the filter changed,
            tell the location list to update its list of locations
        if the search query changed,
            that means the map bounds changed as well, so tell the location list to update its list of locations
        */

        // console.log(
        //     '🚀🚀🚀 ~ file: MapExplorer.js:56 ~ newState.selectedLocation🚀🚀🚀',
        //     selectSelectedLocation(newState)
        // );
        // console.log(
        //     '🚀🚀🚀 ~ file: MapExplorer.js:56 ~ prevState.selectedLocation🚀🚀🚀',
        //     selectSelectedLocation(prevState)
        // );
        const selectedLocation = selectSelectedLocation(newState);
        const prevSelectedLocation = selectSelectedLocation(prevState);

        if (selectedLocation !== prevSelectedLocation) {
            console.log(`🤩: handling state change!`);
            const { map } = this;
            const { latitude, longitude } = selectedLocation;
            const currentZoom = selectZoomLevel(newState);
            console.log(
                '🚀🚀🚀 ~ file: MapExplorer.js:77 ~ currentZoom🚀🚀🚀',
                currentZoom
            );
            const zoomLevel =
                currentZoom < MIN_ZOOM_LEVEL_ON_LOCATION_SELECT
                    ? MIN_ZOOM_LEVEL_ON_LOCATION_SELECT
                    : currentZoom;
            console.log(
                '🚀🚀🚀 ~ file: MapExplorer.js:79 ~ zoomLevel🚀🚀🚀',
                zoomLevel
            );

            map.update({ lat: latitude, lng: longitude }, zoomLevel);
            map.highlightMarker(selectedLocation);
        }
    };

    handleLocationClick = (location) => {
        console.log(`🍕: handleLocationClick ${location.locationName}`);
        store.dispatch(setSelectedLocation(location));
        // store.dispatch(
        //     updateLocation({
        //         location,
        //         latitude: location.buildingLatitude,
        //         longitude: location.buildingLongitude,
        //         zoomLevel: 10, // Consider making this dynamic based on current zoom
        //     })
        // );
        // store.dispatch(setSelectedLocation(location));
    };

    async init() {
        const loader = new Loader(GOOGLE_MAPS_API_OPTIONS);
        await loader.load();

        const data = await this.fetchData();

        console.log(`🍕: data`, data);

        const { locationsArray, latitude, longitude, zoomLevel } = data;

        const lat = Number(latitude);
        const lng = Number(longitude);
        const zoom = Number(zoomLevel);

        store.dispatch(setLocations(locationsArray));
        // store.dispatch(setMapCenter({ lat, lng }));

        await this.map.init({ lat, lng }, zoom);
        this.map.addMarkers(locationsArray);

        this.locationList.init(locationsArray, this.handleLocationClick);
        this.subscribeToStore();
    }

    async fetchData() {
        const response = await fetch('/api/locations');
        return await response.json();
    }
}

export default MapExplorer;
