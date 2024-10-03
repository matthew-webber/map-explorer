class LocationList {
    constructor() {
        this.listContainer = document.getElementById('location-list');
    }

    updateList(locations) {
        this.listContainer.innerHTML = ''; // Clear existing entries
        locations.forEach(location => {
            const listItem = document.createElement('div');
            listItem.textContent = location.name; // Assuming 'name' is a property of location
            this.listContainer.appendChild(listItem);
        });
    }
}

export default LocationList;