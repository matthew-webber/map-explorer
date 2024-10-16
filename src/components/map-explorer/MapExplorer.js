import { store } from '../../store/store.js';
import Map from './Map/Map.js';
import SearchBar from './SearchBar/SearchBar.js';
import Filter from './Filter/Filter.js';
import LocationList from './LocationList/LocationList.js';
import { Loader } from '@googlemaps/js-api-loader';
import { selectSelectedLocation } from '../../store/uiSelectors.js';
import { updateLocation } from '../../store/actions.js'; // Import the new action

// import { setMapCenter, setZoomLevel } from '../../store/mapSlice.js';
import {
    setLocations,
    toggleLocationsChanged,
    selectLocations,
    selectLocationsChanged,
} from '../../store/locationsSlice.js';
import {
    selectMapCenter,
    selectZoomLevel,
    setMapCenter,
    setZoomLevel,
} from '../../store/mapSlice.js';
import { setSelectedLocation } from '../../store/uiSlice.js';

const GOOGLE_MAPS_API_OPTIONS = {
    apiKey: 'AIzaSyD8Q7m2tEwXjBmPEZsxEPEdbcHrxd1brYM', // Replace with your actual API key
    version: 'weekly',
    libraries: ['places', 'geometry', 'marker'],
};

class MapExplorer {
    constructor() {
        this.map = new Map();
        this.searchBar = new SearchBar(this.map);
        this.filter = new Filter(this.map);
        this.locationList = new LocationList();
    }

    // TODO - remove
    // debounce(func, wait, label) {
    //     let timeout;
    //     let counter = 0;

    //     return function (...args) {
    //         const context = this;
    //         const later = function () {
    //             console.log(`⏱️ Total ${label} in window: ${counter}`);
    //             timeout = null;
    //             counter = 0;
    //         };

    //         if (!timeout) {
    //             timeout = setTimeout(later, wait);
    //             counter++;
    //             return func.apply(context, args);
    //         } else {
    //             clearTimeout(timeout);
    //             counter++;
    //             timeout = setTimeout(later, wait);
    //             return counter;
    //         }
    //     };
    // }

    // // TODO - remove
    // debounced = this.debounce(
    //     (label) => {
    //         console.log(`🔔 Debounced: ${label}`);
    //     },
    //     1000,
    //     'render'
    // );

    subscribeToStore = () => {
        store.subscribe(() => {
            // this.debounced('renders caused by store change');
            this.render();
        });
    };

    handleLocationClick(location) {
        store.dispatch(
            updateLocation({
                location,
                latitude: location.buildingLatitude,
                longitude: location.buildingLongitude,
                zoomLevel: 10, // TODO - adjust so that this doesn't change the zoom level unless it's really zoomed out
            })
        );
    }

    async init() {
        const loader = new Loader(GOOGLE_MAPS_API_OPTIONS);
        await loader.load();

        const data = await this.fetchData();

        const { locationsArray, latitude, longitude } = data;
        store.dispatch(setLocations(locationsArray));
        store.dispatch(
            setMapCenter({
                latitude,
                longitude,
            })
        );

        await this.map.init();

        this.locationList.init(data.locationsArray, this.handleLocationClick);
    }

    async fetchData() {
        const response = await fetch('/api/locations');
        return await response.json();
    }

    async render() {
        const state = store.getState();
        const mapCenter = selectMapCenter(state);
        const zoomLevel = selectZoomLevel(state);
        const locations = selectLocations(state);
        const locationsChanged = selectLocationsChanged(state);
        const selectedLocation = selectSelectedLocation(state);

        // console.log(`locationsChanged`, locationsChanged);
        // this.map.updateMap(mapCenter, zoomLevel);

        if (locationsChanged) {
            console.log(`🍕: locations have changed`);
            this.map.addMarkers(locations, selectedLocation);

            store.dispatch(toggleLocationsChanged());
        }
    }
}

export default MapExplorer;
