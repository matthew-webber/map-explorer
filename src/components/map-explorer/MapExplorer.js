import { store } from '../../store/store.js';
import Map from './Map/Map.js';
import SearchBar from './SearchBar/SearchBar.js';
import Filter from './Filter/Filter.js';
import LocationList from './LocationList/LocationList.js';
import { Loader } from '@googlemaps/js-api-loader';
import {
    setLocations,
    setFilteredLocations,
    selectLocations,
    selectHideOutOfBoundsLocations,
} from '../../store/locationsSlice.js';
import { selectZoomLevel, selectMapBounds } from '../../store/mapSlice.js';
import {
    setSelectedLocation,
    selectSelectedLocation,
    selectFilterCategories,
    setFilterCategories,
} from '../../store/uiSlice.js';
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
        this.state = store.getState();
        this.locations = [];
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
        console.log(`⭕️⭕️⭕️⭕️ State changed ⭕️⭕️⭕️⭕️`);
        const locations = selectLocations(newState); // [{ id, name, lat, lng }]
        const mapBounds = selectMapBounds(newState); // { north, south, east, west }
        const prevMapBounds = selectMapBounds(prevState);
        const hideOutOfBounds = selectHideOutOfBoundsLocations(newState); // boolean
        const selectedLocation = selectSelectedLocation(newState); // { id, name, lat, lng }
        const prevSelectedLocation = selectSelectedLocation(prevState);
        const currentFilters = selectFilterCategories(newState); // [{ id, name }]
        const prevFilters = selectFilterCategories(prevState);

        const locationsMatchingFilters = this.applyFilters(
            locations,
            currentFilters
        );

        this.updateSelectedLocation(
            selectedLocation,
            prevSelectedLocation,
            newState
        );
        this.handleSearchProgress(selectSearched(newState));

        console.log(
            `locationsMatchingFilters.length`,
            locationsMatchingFilters.length
        );

        console.log(`hideOutOfBounds`, hideOutOfBounds);
        console.log(`mapBounds`, mapBounds);

        this.updateAndRenderList(
            this.locationList.renderList.bind(this.locationList),
            hideOutOfBounds,
            selectedLocation,
            mapBounds,
            currentFilters
        )(locationsMatchingFilters);

        if (JSON.stringify(prevFilters) !== JSON.stringify(currentFilters)) {
            this.renderMarkers(locationsMatchingFilters, selectedLocation);
        }
    };

    applyFilters(locations, filters) {
        return filters.length > 0
            ? this.locationList.updateLocations('filter', {
                  data: { categories: filters, locations },
              })
            : locations;
    }

    updateSelectedLocation(selectedLocation, prevSelectedLocation, newState) {
        console.log(
            '🚀🚀🚀 ~ file: MapExplorer.js:149 ~ updateSelectedLocation ~ selectedLocation🚀🚀🚀',
            selectedLocation
        );
        if (selectedLocation && selectedLocation !== prevSelectedLocation) {
            const { lat, lng } = selectedLocation;
            const currentZoom = selectZoomLevel(newState);
            const zoomLevel =
                currentZoom < MIN_ZOOM_LEVEL_ON_LOCATION_SELECT
                    ? MIN_ZOOM_LEVEL_ON_LOCATION_SELECT
                    : currentZoom;
            this.map.updateViewport({ lat, lng }, zoomLevel);
            this.map.highlightMarker(selectedLocation);
        }
    }

    handleSearchProgress(searched) {
        if (searched.searchInProgress) {
            const { result, radius } = searched;
            this.map.updateViewport(
                { lat: result.lat, lng: result.lng },
                radius.zoomLevel
            );
            store.dispatch(endSearch());
        }
    }

    /**
     * A wrapper function to render the location list
     * @param {Function} renderFunction - function to render the list
     * @param {boolean} hideOutOfBounds - whether to hide locations outside of the map bounds
     * @param {Object} selectedLocation - the user-selected location
     * @param {Object} mapBounds - the current map bounds
     * @param {Object[]} currentFilters - the current filters
     * @returns {Function} - the render function
     */
    updateAndRenderList(
        renderFunction,
        hideOutOfBounds,
        selectedLocation,
        mapBounds,
        currentFilters
    ) {
        return (locations) => {
            let activeLocations = locations;

            if (hideOutOfBounds && !currentFilters.length) {
                activeLocations = this.locationList.updateLocations('bounds', {
                    data: { bounds: mapBounds, locations },
                });
                console.log(`activeLocations`, activeLocations);
            }

            // prevents an empty list from rendering
            if (activeLocations.length === 0) return;

            renderFunction(activeLocations);

            this.locationList.scrollSelectedToTop(
                selectedLocation.id,
                activeLocations
            );
        };
    }

    renderMarkers(locations, selectedLocation) {
        this.map.updateMarkers(locations);
        this.map.highlightMarker(selectedLocation);
    }

    async init() {
        const loader = new Loader(GOOGLE_MAPS_API_OPTIONS);
        await loader.load();

        // TODO - finish?
        // const rawData = await this.fetchData();
        // const data = this.transformApiData(rawData);

        const data = await this.fetchData();

        const { locationsArray, latitude, longitude, zoomLevel } = data;

        store.dispatch(setLocations(locationsArray));
        store.dispatch(setFilteredLocations(locationsArray));

        const lat = Number(latitude); // initial center
        const lng = Number(longitude); // initial center
        const zoom = Number(zoomLevel);

        // Initialize map and add markers

        await this.map.init({ lat, lng }, zoom);
        this.map.addMarkers(locationsArray);

        // Initialize location list

        this.locationList.init(locationsArray, this.handleLocationClick);

        // this.state = store.getState();
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
        // Flatten the array of categories from all locations
        const allCategories = locations.flatMap(
            (location) => location.categoriesArray
        );

        // Create a new Set to ensure uniqueness, using JSON string to handle object uniqueness
        const uniqueCategories = new Set(
            allCategories.map((category) =>
                JSON.stringify({
                    id: category.categoryID,
                    name: category.categoryName,
                })
            )
        );

        // Convert the Set back to array of objects
        const uniqueCategoryObjects = Array.from(uniqueCategories, (json) =>
            JSON.parse(json)
        );

        // Log the unique categories for debugging
        // console.log(`Unique categories:`, uniqueCategoryObjects);

        return uniqueCategoryObjects;
    }
}

export default MapExplorer;

/*
// TODO
- [x] test if adding return statements after each conditional in handleStateChange breaks the app
- [] add restrictions to the map bounds for autocomplete search
- [] Hollings Cancer Center Mt Pleasant + Gynecology Oncology East Cooper have bad coordinates



*/
