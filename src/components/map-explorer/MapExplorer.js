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
    }
}

export default MapExplorer;