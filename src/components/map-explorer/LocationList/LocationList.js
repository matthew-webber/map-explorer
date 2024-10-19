class LocationList {
    constructor() {
        this.listContainer = document.querySelector('#location-list');
        this.locations = [];
        this.onLocationClick = null;
        this.selectedId = null;
        this.locationsInBounds = [];
    }

    init(locations, onLocationClick) {
        this.locations = locations;
        this.onLocationClick = onLocationClick;
        this.renderList(locations);
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

    getLocationsMatchingCategories(filters) {
        if (filters.length === 0) {
            return this.locations;
        }
        const locationsMatchingCategories = this.locations.filter(
            (location) => {
                // console.log(`location is`, { ...location });
                return location.categoriesArray.some((category) =>
                    filters.includes(category.categoryName)
                );
            }
        );
        console.log(
            `Locations matching categories: ${locationsMatchingCategories.length}`
        );
        return locationsMatchingCategories;
    }

    updateLocations(type, { data }) {
        switch (type) {
            case 'bounds': {
                const { bounds } = data;
                const locationsInBounds = this.getLocationsInBounds(bounds);

                // don't re-render if there are no markers in bounds
                if (locationsInBounds.length === 0) {
                    return;
                }

                this.locationsInBounds = locationsInBounds; // TODO - return this
                this.renderList(locationsInBounds); // TODO - call this in handleStateChange parent and rename this from updateLocations()
                break;
            }
            case 'filter': {
                const { categories } = data;
                console.log(`Filtering by categories: ${categories}`);
                console.log(`data is`, { ...data });

                this.locationsMatchingCategories =
                    this.getLocationsMatchingCategories(categories);

                this.renderList(this.locationsMatchingCategories); // TODO - call this in handleStateChange parent and rename this from updateLocations()
                return this.locationsMatchingCategories;

                break;
            }
            default:
                break;
        }
    }

    scrollSelectedToTop(id) {
        if (this.locationInBounds(id)) {
            const listItem = document.querySelector(`[data-id="${id}"]`);
            listItem.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
    }

    locationInBounds(id) {
        return this.locationsInBounds.find(
            (location) => location.locationId === id
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
                this.onLocationClick(location);
            });
        });
    }
}

export default LocationList;
