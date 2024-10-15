import { store } from '../../../store/store'; // Import the store
import { setSelectedLocation } from '../../../store/uiSlice.js';
import { selectLocations } from '../../../store/locationsSlice.js';

class LocationList {
    // Modify the constructor to accept a click handler
    constructor() {
        this.listContainer = document.querySelector('#location-list');
        this.subscribeToStore(); // Initialize the store subscription
    }

    subscribeToStore = () => {
        // store.subscribe(() => {
        //     const locations = selectLocations(store.getState());
        //     if (locations !== this.prevLocations) {
        //         console.warn(
        //             `locations have changed: ${locations.length} locations`
        //         );
        //         this.renderList(locations);
        //         this.prevLocations = locations; // Update previous locations
        //     }
        // });
    };

    init(locations, onLocationClick) {
        console.log(`🐢 called renderList`);
        this.listContainer.innerHTML = ''; // Clear existing entries
        locations.forEach((location) => {
            const listItem = document.createElement('div');
            listItem.setAttribute('id', location.locationId);
            listItem.classList.add('location-item');
            listItem.textContent = location.locationName;

            // Attach click event to list item
            listItem.addEventListener('click', () => {
                onLocationClick(location);
            });

            this.listContainer.appendChild(listItem);
        });
    }
}

export default LocationList;
