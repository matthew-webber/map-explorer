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

class MapExplorer {
    constructor() {
        this.map = new Map();
        this.searchBar = new SearchBar(this.map);
        this.filter = new Filter(this.map);
        this.locationList = new LocationList();
        console.log(`123 finished mapexplorer init`);
    }

    async init() {
        const data = await this.fetchData();
        console.log(`asdf data.locationsArray ${data.locationsArray}`);
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
