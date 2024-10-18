// @ts-check

// import { store } from '../../../store/store'; // Import the store
// import { setMapCenter } from '../../../store/mapSlice.js';
// import { selectMapCenter } from '../../../store/mapSelectors.js';

import { store } from '../../../store/store'; // Import the store
import { setMapCenter } from '../../../store/mapSlice.js';
import { setSearchedLocation } from '../../../store/searchSlice.js';

let foo = true;

foo = 42;

console.log(`foo: ${foo}`);

class SearchBar {
    constructor() {
        this.setupEventListeners();
    }

    setupAutocomplete() {
        const input = document.querySelector('#search-input');
        const zoomLevel = document.querySelector('#zoom-level').value;

        const options = {
            types: ['(cities)'],
            componentRestrictions: { country: 'us' },
        };
        this.autocomplete = new google.maps.places.Autocomplete(input, options);
        this.autocomplete.addListener('place_changed', () => {
            const place = this.autocomplete.getPlace();
            if (place.geometry) {
                const { lat, lng } = place.geometry.location;
                // Dispatch action to update search state in the Redux store
                store.dispatch(
                    setSearchedLocation({
                        lat: lat(),
                        lng: lng(),
                        zoom: zoomLevel,
                    })
                );
            } else {
                alert("No details available for input: '" + place.name + "'");
            }
        });
    }

    setupEventListeners() {
        document.getElementById('search-btn').addEventListener('click', () => {
            const input = document.querySelector('#search-input').value;
            console.log(
                `this.autocomplete.getPlace() ${
                    this.autocomplete.getPlace().geometry.location
                }`
            );
        });
    }
}

export default SearchBar;
