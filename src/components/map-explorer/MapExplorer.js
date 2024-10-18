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
    setZoomLevel,
    selectMapBounds,
} from '../../store/mapSlice.js';
import {
    setSelectedLocation,
    selectSelectedLocation,
} from '../../store/uiSlice.js';
import { updateLocation } from '../../store/actions.js';
import {
    setSearch,
    selectSearchQuery,
    selectSearchResult,
    selectSearchRadius,
} from '../../store/searchSlice.js';

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

    handleSearch = (search) => {
        const prevQuery = selectSearchQuery(store.getState());

        console.log(
            '🚀🚀🚀 ~ file: MapExplorer.js:84 ~ prevQuery=',
            prevQuery,
            ' // query=',
            search.query,
            '🚀🚀🚀'
        );
        if (search.query !== prevQuery) {
            const { query, result, radius } = search;

            const lat = result.geometry.location.lat();
            const lng = result.geometry.location.lng();

            console.log(
                `🍕🍕🍕🍕🍕🍕🍕🍕: handleSearch ${query} ${lat} ${lng} ${radius} 🍕🍕🍕🍕🍕🍕🍕🍕`
            );

            store.dispatch(setSearch({ query, lat, lng, radius }));
        }
    };

    handleSearchError = () => {
        this.searchBar.toggleValidationMessage('Please enter a location');
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

        if (selectedLocation && selectedLocation !== prevSelectedLocation) {
            const { lat, lng } = selectedLocation;
            const currentZoom = selectZoomLevel(newState);
            const zoomLevel =
                currentZoom < MIN_ZOOM_LEVEL_ON_LOCATION_SELECT
                    ? MIN_ZOOM_LEVEL_ON_LOCATION_SELECT
                    : currentZoom;

            this.map.update({ lat, lng }, zoomLevel);
            this.map.highlightMarker(selectedLocation);
        }

        const mapBounds = selectMapBounds(newState);
        const prevMapBounds = selectMapBounds(prevState);
        const hideOutOfBounds = selectHideOutOfBoundsLocations(newState);

        if (mapBounds !== prevMapBounds && hideOutOfBounds) {
            console.log(
                `🤩: handling state change! :: mapBounds !== prevMapBounds && hideOutOfBounds`
            );
            this.locationList.updateLocations('bounds', {
                data: { bounds: mapBounds },
            });
        }

        const searchLocation = selectSearchQuery(newState);
        const prevSearchLocation = selectSearchQuery(prevState);

        console.log(`searchLocation`, searchLocation);
        console.log(`prevSearchLocation`, prevSearchLocation);

        if (searchLocation !== prevSearchLocation) {
            console.log(
                `🤩: handling state change! :: searchLocation !== prevSearchLocation`
            );

            const searchResult = selectSearchResult(newState);
            const searchRadius = selectSearchRadius(newState);

            this.locationList.updateLocations('bounds', {
                data: { bounds: mapBounds },
            });

            this.map.update(
                {
                    lat: searchResult.lat,
                    lng: searchResult.lng,
                },
                searchRadius
            );
        }
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

        this.state = store.getState();
        this.subscribeToStore();

        const autocompleteOptions = {
            types: ['(cities)'],
            componentRestrictions: { country: 'us' },
            fields: ['geometry'],
        };
        this.searchBar.init(
            autocompleteOptions,
            this.handleSearch,
            this.handleSearchError
        );

        this.addSetZoomLevelButtonToDom();
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

    addSetZoomLevelButtonToDom() {
        const button = document.createElement('button');
        button.innerText = 'Set Zoom Level';
        button.addEventListener('click', () => {
            const zoomLevel = prompt('Enter a zoom level');
            store.dispatch(setZoomLevel(zoomLevel));
        });
        document.body.appendChild(button);
    }
}

export default MapExplorer;
