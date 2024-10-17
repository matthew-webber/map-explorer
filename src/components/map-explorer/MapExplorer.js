import { store } from '../../store/store.js';
import Map from './Map/Map.js';
import SearchBar from './SearchBar/SearchBar.js';
import Filter from './Filter/Filter.js';
import LocationList from './LocationList/LocationList.js';
import { Loader } from '@googlemaps/js-api-loader';
import {
    setLocations,
    selectLocations,
    selectHideOutOfBoundsLocations,
} from '../../store/locationsSlice.js';
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
        this.locationList = new LocationList(this.handleLocationClick);
        this.state = null;
    }

    subscribeToStore = () => {
        store.subscribe(() => {
            const newState = store.getState();
            console.log(
                '🚀🚀🚀 ~ file: MapExplorer.js:47 ~ store.subscribe ~ this.state🚀🚀🚀',
                this.state
            );
            console.log(
                '🚀🚀🚀 ~ file: MapExplorer.js:51 ~ store.subscribe ~ newState🚀🚀🚀',
                newState
            );
            this.handleStateChange(this.state, newState);
            this.state = newState;
        });
    };

    handleStateChange = (prevState, newState) => {
        console.log(`🤔: handling state change?`);
        /*
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
            // TODO - better way to handle this?
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

        const mapBounds = selectMapBounds(newState);
        const prevMapBounds = selectMapBounds(prevState);
        const hideOutOfBounds = selectHideOutOfBoundsLocations(newState);
        console.log(`mapBounds !== prevMapBounds`, mapBounds !== prevMapBounds);

        if (mapBounds !== prevMapBounds && hideOutOfBounds) {
            console.log(`🤩: handling state change!`);
            this.locationList.updateLocations('bounds', {
                data: { bounds: mapBounds },
            });
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

        // TODO - finish?
        // const rawData = await this.fetchData();
        // const data = this.transformApiData(rawData);

        const data = await this.fetchData();

        const { locationsArray, latitude, longitude, zoomLevel } = data;

        const lat = Number(latitude);
        const lng = Number(longitude);
        const zoom = Number(zoomLevel);

        // store.dispatch(setLocations(locationsArray));
        // store.dispatch(setMapCenter({ lat, lng }));

        await this.map.init({ lat, lng }, zoom);
        this.map.addMarkers(locationsArray);

        this.locationList.init(locationsArray, this.handleLocationClick);
        this.locationList.renderList(locationsArray);

        this.state = store.getState();
        this.subscribeToStore();
    }

    async fetchData() {
        const response = await fetch('/api/locations');
        return await response.json();
    }

    // TODO - finish?
    transformApiData(data) {
        const {
            locationsArray,
            latitude,
            longitude,
            zoomLevel,
            hideFilterBar,
            componentId,
        } = data;
        const locations = locationsArray.map((location) => ({
            ...location,
            id: location.locationId,
            lat: Number(location.buildingLatitude),
            lng: Number(location.buildingLongitude),
            name: location.locationName,
        }));
        const lat = Number(latitude);
        const lng = Number(longitude);
        const zoom = Number(zoomLevel);

        return { locations, lat, lng, zoom, hideFilterBar, componentId };
    }
}

export default MapExplorer;
