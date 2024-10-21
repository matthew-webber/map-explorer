// @ts-check

class LocationList {
    constructor() {
        this.listContainer = document.querySelector('#location-list');
        this.onLocationClick = null;
        this.selectedId = null;
        this.locationsInBounds = [];
    }

    init(locations, onLocationClick) {
        this.onLocationClick = onLocationClick;
        this.renderList(locations);
    }

    getLocationsInBounds(bounds, locations) {
        return [...locations].filter((location) => {
            const isWithinBounds =
                bounds.south < location.buildingLatitude &&
                location.buildingLatitude < bounds.north &&
                bounds.west < location.buildingLongitude &&
                location.buildingLongitude < bounds.east;

            return isWithinBounds;
        });
    }

    getLocationsMatchingCategories(filters, locations) {
        if (filters.length === 0) {
            return locations;
        }
        const locationsMatchingCategories = locations.filter((location) => {
            return location.categoriesArray.some((category) =>
                filters
                    .map((filter) => filter.name)
                    .includes(category.categoryName)
            );
        });
        return locationsMatchingCategories;
    }

    updateLocations(type, { data }) {
        const { bounds, categories, locations } = data;

        switch (type) {
            case 'bounds': {
                const locationsInBounds = this.getLocationsInBounds(
                    bounds,
                    locations
                );

                return locationsInBounds;
            }
            case 'filter': {
                const filteredLocations = this.getLocationsMatchingCategories(
                    categories,
                    locations
                );

                return filteredLocations;
            }
            default:
                break;
        }
    }

    scrollSelectedToTop(id, locations) {
        console.log(`id is ${id}`);
        if (this.locationInBounds(id, locations)) {
            const listItem = document.querySelector(`[data-id="${id}"]`);
            // @ts-ignore
            listItem.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
    }

    locationInBounds(id, locations) {
        return locations.find((location) => location.locationId === id);
    }

    renderList(locations) {
        console.log(`asdf renderList`);
        // @ts-ignore
        this.listContainer.innerHTML = ''; // Clear existing entries

        locations.forEach((location) => {
            const listItem = document.createElement('div');
            listItem.setAttribute('data-id', location.locationId); // for scrolling on click

            listItem.classList.add('location-item');
            listItem.textContent = location.locationName;

            // @ts-ignore
            this.listContainer.appendChild(listItem);

            listItem.addEventListener('click', () => {
                this.selectedId = location.locationId; // use ID instead of node because node may be removed
                this.onLocationClick(location);
            });
        });
    }
}

export default LocationList;
