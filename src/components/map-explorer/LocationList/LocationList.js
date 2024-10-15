import { store } from '../../../store/store'; // Import the store
import { setSelectedLocation } from '../../../store/uiSlice.js';
import { selectLocationsList } from '../../../store/locationsSelectors.js';

class LocationList {
    // Modify the constructor to accept a click handler
    constructor(onLocationClick) {
        this.listContainer = document.querySelector('#location-list');
        this.onLocationClick = onLocationClick;
        this.subscribeToStore(); // Initialize the store subscription
        this.prevLocations = null; // Initialize previous locations
    }

    subscribeToStore = () => {
        store.subscribe(() => {
            const locations = selectLocationsList(store.getState());
            if (locations !== this.prevLocations) {
                console.warn(
                    `locations have changed: ${locations.length} locations`
                );
                this.renderList(locations);
                this.prevLocations = locations; // Update previous locations
            }
        });
    };

    renderList(locations) {
        this.listContainer.innerHTML = ''; // Clear existing entries
        locations.forEach((location) => {
            const listItem = document.createElement('div');
            listItem.setAttribute('id', location.locationId);
            listItem.classList.add('location-item');
            listItem.textContent = location.locationName;

            // Attach click event to list item
            listItem.addEventListener('click', () => {
                this.onLocationClick(location);
            });

            this.listContainer.appendChild(listItem);
        });
    }
}

export default LocationList;
