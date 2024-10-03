class Filter {
    constructor(mapInstance) {
        this.mapInstance = mapInstance;
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('wheelchair-accessible').addEventListener('change', (event) => {
            this.mapInstance.applyFilter({ wheelchairAccessible: event.target.checked });
        });
    }
}

export default Filter;