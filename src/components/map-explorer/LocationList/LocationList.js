class LocationList {
    constructor() {
        this.listContainer = document.querySelector('#location-list');
        this.locations = [];
        this.onLocationClick = null;
    }

    init(locations, onLocationClick) {
        this.locations = locations;
        this.onLocationClick = onLocationClick;
    }

    updateLocations(type, { data }) {
        switch (type) {
            case 'bounds': {
                const { bounds } = data;
                const markersInBounds = [...this.locations].filter(
                    (location) => {
                        const isWithinBounds =
                            bounds.south < location.buildingLatitude &&
                            location.buildingLatitude < bounds.north &&
                            bounds.west < location.buildingLongitude &&
                            location.buildingLongitude < bounds.east;

                        return isWithinBounds;
                    }
                );

                this.renderList(markersInBounds);
                break;
            }
            case 'filter':
                // Get locations based on filter
                break;
            default:
                break;
        }
    }

    scrollSelectedToTop(listItem) {
        listItem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    setSelectedLocation(location, listItem) {}

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
                // smooth scroll to this list item until it's at the top of the listContainer
                this.setSelectedLocation(location, listItem);
                // this.scrollSelectedToTop(listItem);
            });

            this.listContainer.appendChild(listItem);
        });
    }
}

export default LocationList;
