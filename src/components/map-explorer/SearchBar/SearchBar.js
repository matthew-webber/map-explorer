class SearchBar {
    constructor() {
        this.input = document.querySelector('#search-input');
        this.searchRadius = document.querySelector('#search-radius');
        this.searchButton = document.querySelector('#search-btn');
        this.validationMessage = document.querySelector('.validation-message');

        this.onSearch = () => {};
        this.onError = () => {};

        this.autocomplete = {
            widget: null,
            place: null,
            queryString: '',
        };
    }

    init(autocompleteOptions, onSearch, onError) {
        this.onSearch = onSearch;
        this.onError = onError;
        this.setupAutocomplete(autocompleteOptions);
        this.setupEventListeners();
    }

    setupAutocomplete(options) {
        this.autocomplete.widget = new google.maps.places.Autocomplete(
            this.input,
            options
        );

        // Since this only fires when the user selects a place from the dropdown,
        // we can be sure that the input value is invalid if the place is not set
        // or if the input value has changed since the place was selected.
        this.autocomplete.widget.addListener('place_changed', () => {
            this.autocomplete.place = this.autocomplete.widget.getPlace(); // the selected place
            this.autocomplete.queryString = this.input.value; // the string in the input when the place was selected
        });
    }

    /**
     * Verifies that the search is valid before calling the search handler
     * otherwise it calls the error handler
     */

    verifyAndSearch() {
        if (
            !this.autocomplete.place || // no place selected
            this.autocomplete.queryString !== this.input.value // input value has changed since selection
        ) {
            this.onError();
            return;
        }

        this.onSearch({
            result: this.autocomplete.place,
            query: this.input.value,
            radius: this.searchRadius.value,
        });
    }

    setupEventListeners() {
        this.searchButton.addEventListener('click', () => {
            this.verifyAndSearch();
        });
        this.input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                this.verifyAndSearch();
            }
        });
    }

    toggleValidationMessage(message) {
        // show the error

        setTimeout(() => {
            // hide the error after 5 seconds
        }, 5000);
    }
}

export default SearchBar;
