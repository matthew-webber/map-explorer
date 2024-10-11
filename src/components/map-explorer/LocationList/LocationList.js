import { store } from '../../../store/store'; // Import the store

class LocationList {
    // Modify the constructor to accept a click handler
    constructor(onLocationClick) {
        // {{ edit_1 }}
        this.listContainer = document.getElementById('location-list');
        this.onLocationClick = onLocationClick; // {{ edit_2 }}
        this.subscribeToStore(); // Initialize the store subscription
    }

    subscribeToStore = () => {
        store.subscribe(() => {
            const locations = store.getState().locations.data;
            this.updateList(locations);
        });
    };

    updateList(locations) {
        this.listContainer.innerHTML = ''; // Clear existing entries
        locations.forEach((location) => {
            const listItem = document.createElement('div');
            listItem.classList.add('location-item');
            listItem.textContent = location.locationName;

            // Attach click event to list item
            listItem.addEventListener('click', () => {
                this.onLocationClick(location); // {{ edit_3 }}
            });

            this.listContainer.appendChild(listItem);
        });
    }
}

export default LocationList;
