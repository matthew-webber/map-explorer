import { store } from '../../../store/store'; // Import the store
import { setSelectedLocation } from '../../../store/uiSlice.js';
import { selectLocations } from '../../../store/locationsSlice.js';

class LocationList {
    constructor() {
        this.listContainer = document.querySelector('#location-list');
    }

    init(locations, onLocationClick) {
        this.onLocationClick = onLocationClick;
        this.renderList(locations);
    }

    update(locations) {
        this.renderList(locations);
    }

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
