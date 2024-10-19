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
    selectFilterCategories,
    setFilterCategories,
} from '../../store/uiSlice.js';
import { updateLocation } from '../../store/actions.js';
import {
    startSearch,
    endSearch,
    selectSearched,
} from '../../store/searchSlice.js';

const GOOGLE_MAPS_API_OPTIONS = {
    apiKey: 'AIzaSyD8Q7m2tEwXjBmPEZsxEPEdbcHrxd1brYM',
    version: 'weekly',
    libraries: ['places', 'geometry', 'marker'],
};

const MIN_ZOOM_LEVEL_ON_LOCATION_SELECT = 10;

class MapExplorer {
    constructor() {
        this.map = new Map(this.handleLocationClick);
        this.searchBar = new SearchBar();
        this.filter = new Filter();
        this.locationList = new LocationList(this.handleLocationClick);
        this.state = null;
    }

    subscribeToStore = () => {
        store.subscribe(() => {
            const newState = store.getState();
            this.handleStateChange(this.state, newState);
            this.state = newState;
        });
    };

    handleLocationClick = (location) => {
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
        const { query, result, radius } = search;

        const lat = result.geometry.location.lat();
        const lng = result.geometry.location.lng();

        store.dispatch(startSearch({ query, lat, lng, radius }));
    };

    handleSearchError = () => {
        this.searchBar.toggleValidationMessage('Please enter a location');
    };

    handleFilterChange = (filters) => {
        store.dispatch(setFilterCategories(filters));
    };

    handleStateChange = (prevState, newState) => {
        /*
        if the map bounds changed,
            tell the location list to update its list of locations
        if the filter changed,
            tell the location list to update its list of locations
        if the search query changed,
            that means the map bounds changed as well, so tell the location list to update its list of locations
        */

        const mapBounds = selectMapBounds(newState);
        const prevMapBounds = selectMapBounds(prevState);
        const hideOutOfBounds = selectHideOutOfBoundsLocations(newState);

        if (mapBounds !== prevMapBounds && hideOutOfBounds) {
            this.locationList.updateLocations('bounds', {
                data: { bounds: mapBounds },
            });
            this.locationList.scrollSelectedToTop(
                selectSelectedLocation(newState).id
            );
        }

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

        const searched = selectSearched(newState);

        if (searched.searchInProgress) {
            const { result, radius } = searched;

            this.map.update(
                {
                    lat: result.lat,
                    lng: result.lng,
                },
                radius.zoomLevel
            );

            store.dispatch(endSearch(newState));
        }

        const prevFilters = selectFilterCategories(prevState);
        const currentFilters = selectFilterCategories(newState);

        if (prevFilters !== currentFilters) {
            this.applyFilters(currentFilters);
        }
    };

    applyFilters(filters) {
        const filteredLocations = this.locationList.updateLocations('filter', {
            data: { categories: filters },
        });
        console.log(`filteredLocations is`, filteredLocations);
        this.map.updateMarkers(filteredLocations);
    }

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

        const categories = this.extractCategories(data.locationsArray);
        this.filter.init(categories, this.handleFilterChange);
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

    extractCategories(locations) {
        const categorySet = new Set();
        locations.forEach((location) => {
            location.categoriesArray.forEach((category) => {
                categorySet.add(category.categoryName);
            });
        });
        return Array.from(categorySet);
    }
}

export default MapExplorer;

/*
// TODO
- [] test if adding return statements after each conditional in handleStateChange breaks the app
- [] add restrictions to the map bounds for autocomplete search


*/
