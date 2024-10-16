// import { store } from '../../../store/store'; // Import the store
// import { setMapCenter } from '../../../store/mapSlice.js';
// import { selectMapCenter } from '../../../store/mapSelectors.js';

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
                this.mapInstance.update(
                    { lat: lat(), lng: lng() },
                    this.mapInstance.zoomLevel
                );
                this.onMapCenterChange({ lat: lat(), lng: lng() });
            } else {
                alert("No details available for input: '" + place.name + "'");
            }
        });
    }

    // Add a method to set the callback
    setMapCenterChangeCallback(callback) {
        this.onMapCenterChange = callback;
    }

    setupEventListeners() {
        // this.setupAutocomplete();
        document.getElementById('search-btn').addEventListener('click', () => {
            const input = document.getElementById('search-input').value;
            console.log(
                `this.autocomplete.getPlace() ${
                    this.autocomplete.getPlace().geometry.location
                }`
            );
        });
    }
}

export default SearchBar;
