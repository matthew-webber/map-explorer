import { store } from '../../../store/store'; // Import the store

class SearchBar {
    constructor(mapInstance) {
        this.mapInstance = mapInstance;
        this.setupEventListeners();
    }

    setupAutocomplete() {
        const input = document.getElementById('search-input');
        const options = {
            types: ['(cities)'],
            componentRestrictions: { country: 'us' },
        };
        this.autocomplete = new google.maps.places.Autocomplete(input, options);

        this.autocomplete.addListener('place_changed', () => {
            const place = this.autocomplete.getPlace();
            if (place.geometry) {
                const { lat, lng } = place.geometry.location;
                this.mapInstance.updateMap(
                    { lat: lat(), lng: lng() },
                    this.mapInstance.zoomLevel
                );
                store.dispatch(setMapCenter({ lat: lat(), lng: lng() }));
            } else {
                alert("No details available for input: '" + place.name + "'");
            }
        });
    }

    setupEventListeners() {
        this.setupAutocomplete();
        document.getElementById('search-btn').addEventListener('click', () => {
            const address = document.getElementById('search-input').value;
            const zoomLevel = parseInt(
                document.getElementById('zoom-level').value,
                10
            );
            this.mapInstance.searchLocation(address, zoomLevel);
        });
    }
}

export default SearchBar;
