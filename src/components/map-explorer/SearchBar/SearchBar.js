class SearchBar {
    constructor(mapInstance) {
        this.mapInstance = mapInstance;
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('search-btn').addEventListener('click', () => {
            const address = document.getElementById('search-input').value;
            const zoomLevel = parseInt(document.getElementById('zoom-level').value, 10);
            this.mapInstance.searchLocation(address, zoomLevel);
        });
    }
}

export default SearchBar;