import { store } from '../../../store/store'; // Import the store

class LocationList {
    constructor() {
        this.listContainer = document.getElementById('location-list');
        this.subscribeToStore(); // Initialize the store subscription
    }

    subscribeToStore = () => {
        store.subscribe(() => {
            const locations = store.getState().locations.data;
            // log all the properties of locations
            for (var key in locations) {
                console.log(
                    `asdf locations key ${key} value ${locations[key]}`
                );
            }
            this.updateList(locations);
        });
    };

    updateList(locations) {
        this.listContainer.innerHTML = ''; // Clear existing entries
        locations.forEach((location) => {
            const listItem = document.createElement('div');
            listItem.classList.add('location-item');
            listItem.textContent = location.locationName; // Assuming 'name' is a property of location
            this.listContainer.appendChild(listItem);
        });
    }
}

export default LocationList;
