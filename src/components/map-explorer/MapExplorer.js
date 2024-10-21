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
    selectFilteredLocations,
    selectHideOutOfBoundsLocations,
} from '../../store/locationsSlice.js';
import { selectZoomLevel, selectMapBounds } from '../../store/mapSlice.js';
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
        // const locations = selectLocations(store.getState());

        // const filteredLocations = locations.filter((location) => {
        //     const locationPassesFilters = filters.every((filter) => {
        //         const foo = location.categoriesArray.map((category) => {
        //             return category.categoryID;
        //         });
        //         const locationHasFilter = foo.includes(filter.id);
        //         return locationHasFilter;
        //     });
        //     return locationPassesFilters;
        // });

        // store.dispatch(setFilteredLocations(filteredLocations));
    };

    handleStateChange = (prevState, newState) => {
        const locations = selectLocations(newState);

        let locationsInBounds = locations;
        let locationsMatchingFilters = locations;

        const mapBounds = selectMapBounds(newState);
        const prevMapBounds = selectMapBounds(prevState);
        const hideOutOfBounds = selectHideOutOfBoundsLocations(newState);

        const selectedLocation = selectSelectedLocation(newState);
        const prevSelectedLocation = selectSelectedLocation(prevState);

        const prevFilters = selectFilterCategories(prevState);
        const currentFilters = selectFilterCategories(newState);

        // Apply filters if they exist, regardless of whether they changed
        if (currentFilters.length > 0) {
            locationsMatchingFilters = this.locationList.updateLocations(
                'filter',
                {
                    data: { categories: currentFilters, locations },
                }
            );
        }

        if (mapBounds !== prevMapBounds && hideOutOfBounds) {
            locationsInBounds = this.locationList.updateLocations('bounds', {
                data: {
                    bounds: mapBounds,
                    locations,
                },
            });
        }

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

        const searched = selectSearched(newState);
        if (searched.searchInProgress) {
            const { result, radius } = searched;
            this.map.updateViewport(
                {
                    lat: result.lat,
                    lng: result.lng,
                },
                radius.zoomLevel
            );
            store.dispatch(endSearch(newState));
        }

        // Determine final set of locations to display based on bounds and filters
        const finalLocations = locationsMatchingFilters.filter((location) =>
            locationsInBounds.includes(location)
        );

        console.log(`Final locations: ${finalLocations.length}`);

        finalLocations.length > 0 &&
            // IIFE
            (() => {
                if (mapBounds !== prevMapBounds && !currentFilters.length) {
                    this.locationList.renderList(finalLocations);
                    return;
                }
                if (
                    JSON.stringify(prevFilters) !==
                    JSON.stringify(currentFilters)
                ) {
                    this.locationList.renderList(finalLocations);
                    this.map.updateMarkers(finalLocations);
                    return;
                }
            })();
    };

    arraysEqual(a, b) {
        return JSON.stringify(a) === JSON.stringify(b);
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

        const lat = Number(latitude);
        const lng = Number(longitude);
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
- [] test if adding return statements after each conditional in handleStateChange breaks the app
- [] add restrictions to the map bounds for autocomplete search


*/
