import {
    store,
    setLocations,
    setMapCenter,
    setZoomLevel,
} from '../../store/store.js';
import Map from './Map/Map.js';
import SearchBar from './SearchBar/SearchBar.js';
import Filter from './Filter/Filter.js';
import LocationList from './LocationList/LocationList.js';
import { Loader } from '@googlemaps/js-api-loader';

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
        this.map.focusOnLocation(location);
    }

    async init() {
        const loader = new Loader(GOOGLE_MAPS_API_OPTIONS);
        await loader.load();
        // Initialize the map after the API has loaded
        // this.map.init();

        const data = await this.fetchData();
        console.log('google', { ...google });
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
    }
}

export default MapExplorer;
