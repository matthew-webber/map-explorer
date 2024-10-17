class LocationList {
    constructor() {
        this.listContainer = document.querySelector('#location-list');
        this.locations = [];
        this.onLocationClick = null;
        this.selectedId = null;
    }

    init(locations, onLocationClick) {
        this.locations = locations;
        this.onLocationClick = onLocationClick;
    }

    getLocationsInBounds(bounds) {
        return [...this.locations].filter((location) => {
            const isWithinBounds =
                bounds.south < location.buildingLatitude &&
                location.buildingLatitude < bounds.north &&
                bounds.west < location.buildingLongitude &&
                location.buildingLongitude < bounds.east;

            return isWithinBounds;
        });
    }

    updateLocations(type, { data }) {
        switch (type) {
            case 'bounds': {
                const { bounds } = data;
                const locationsInBounds = this.getLocationsInBounds(bounds);

                // don't render if there are no markers in bounds
                if (locationsInBounds.length === 0) {
                    return;
                }

                this.locationsInBounds = locationsInBounds;
                this.renderList(locationsInBounds);
                break;
            }
            case 'filter':
                // Get locations based on filter
                break;
            default:
                break;
        }
    }

    scrollSelectedToTop(id) {
        const listItem = document.querySelector(`[data-id="${id}"]`);
        listItem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    selectedInBounds() {
        return this.locationsInBounds.find(
            (location) => location.locationId === this.selectedId
        );
    }

    renderList(locations) {
        this.listContainer.innerHTML = ''; // Clear existing entries

        locations.forEach((location) => {
            const listItem = document.createElement('div');
            listItem.setAttribute('data-id', location.locationId); // for scrolling on click

            listItem.classList.add('location-item'); // TODO - does this class do anything?
            listItem.textContent = location.locationName;

            this.listContainer.appendChild(listItem);

            // Attach click event to list item
            listItem.addEventListener('click', () => {
                this.selectedId = location.locationId; // use ID instead of node because node may be removed
                console.log(`🍕: this.selectedId`, this.selectedId);
                this.onLocationClick(location);
            });
        });

        // TODO - don't love it
        if (this.selectedId && this.selectedInBounds()) {
            this.scrollSelectedToTop(this.selectedId);
        }
    }
}

export default LocationList;
