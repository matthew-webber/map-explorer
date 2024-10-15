import { store } from '../../store/store.js';
import Map from './Map/Map.js';
import SearchBar from './SearchBar/SearchBar.js';
import Filter from './Filter/Filter.js';
import LocationList from './LocationList/LocationList.js';
import { Loader } from '@googlemaps/js-api-loader';
import { setLocations } from '../../store/locationsSlice.js';
import { setMapCenter, setZoomLevel } from '../../store/mapSlice.js';
import { setSelectedLocation } from '../../store/uiSlice.js';
import { selectMapCenter, selectZoomLevel } from '../../store/mapSelectors.js';
import { selectLocationsList } from '../../store/locationsSelectors.js';

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
        // Pass the handleLocationClick method as a callback to LocationList
        this.locationList = new LocationList(
            this.handleLocationClick.bind(this)
        );

        this.handleMapCenterChange = (newCenter) => {
            store.dispatch(setMapCenter(newCenter));
        };

        this.searchBar.setMapCenterChangeCallback(this.handleMapCenterChange);
    }

    handleLocationClick(location) {
        store.dispatch(setSelectedLocation(location));
        store.dispatch(
            setMapCenter({
                lat: Number(location.buildingLatitude),
                lng: Number(location.buildingLongitude),
            })
        );
        store.dispatch(setZoomLevel(10)); // Example zoom level
        // ... existing code ...
        // this.map.focusOnLocation(location); // Removed direct call
    }

    async init() {
        const loader = new Loader(GOOGLE_MAPS_API_OPTIONS);
        await loader.load();
        // Initialize the map after the API has loaded
        // this.map.init();

        const data = await this.fetchData();
        store.dispatch(setLocations(data.locationsArray));
        store.dispatch(
            setMapCenter({
                lat: Number(data.latitude),
                lng: Number(data.longitude),
            })
        );
        store.dispatch(setZoomLevel(Number(data.zoomLevel)));
    }

    async fetchData() {
        const response = await fetch('/api/locations');
        return await response.json();
    }

    async render() {
        await this.map.init();
        // this.searchBar.render();
        // this.filter.render();
        // this.locationList.render();

        const state = store.getState();
        const mapCenter = selectMapCenter(state);
        const zoomLevel = selectZoomLevel(state);
        const locations = selectLocationsList(state);
        this.map.updateMap(mapCenter, zoomLevel);
        this.map.addMarkers(locations);
    }
}

export default MapExplorer;
