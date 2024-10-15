import { store } from '../../../store/store'; // Import the store
import { setSelectedLocation } from '../../../store/uiSlice.js';
import { selectLocations } from '../../../store/locationsSelectors.js';

class LocationList {
    // Modify the constructor to accept a click handler
    constructor(onLocationClick) {
        this.listContainer = document.querySelector('#location-list');
        this.onLocationClick = onLocationClick;
        this.subscribeToStore(); // Initialize the store subscription
    }

    subscribeToStore = () => {
        store.subscribe(() => {
            const locations = selectLocations(store.getState());
            this.updateList(locations);
        });
    };

    updateList(locations) {
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
