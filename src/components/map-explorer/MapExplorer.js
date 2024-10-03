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
        this.init();
    }

    init = async () => {
        const data = await this.fetchData();
        let { locationsArray, latitude, longitude, zoomLevel } = data;

        latitude = Number(latitude);
        longitude = Number(longitude);
        zoomLevel = Number(zoomLevel);

        this.map.init(latitude, longitude, zoomLevel);
        // this.map.init();
    };

    fetchData = async () => {
        const response = await fetch('/api/locations');
        return await response.json();
        // this.locationList.update(data.locationsArray); // Assuming update method exists
    };
}

export default MapExplorer;
