class Filter {
    constructor() {
        this.filterContainer = document.querySelector('#filter-bar');
        this.selectedCategories = [];

        this.onFilterChange = () => {};
    }

    init(categories, onFilterChange) {
        this.onFilterChange = onFilterChange;
        this.renderCategories(categories);
    }

    renderCategories(categories) {
        this.filterContainer.innerHTML = ''; // Clear previous filters
        categories.forEach((category) => {
            const checkbox = document.createElement('input');
            const label = document.createElement('label');
            checkbox.type = 'checkbox';
            checkbox.id = category;
            checkbox.value = category;
            label.htmlFor = category;
            label.textContent = category;
            label.prepend(checkbox);

            // Attach a more isolated event handler
            checkbox.addEventListener(
                'change',
                this.handleCheckboxChange.bind(this, category, checkbox)
            );

            this.filterContainer.appendChild(label);
        });
    }

    handleCheckboxChange(category, checkbox) {
        console.log(`Checkbox ${category} changed to ${checkbox.checked}`);
        console.log(
            'Array.isArray(this.selectedCategories)',
            Array.isArray(this.selectedCategories)
        );
        if (checkbox.checked) {
            this.selectedCategories = [...this.selectedCategories, category];
        } else {
            this.selectedCategories = this.selectedCategories.filter(
                (selectedCategory) => selectedCategory !== category
            );
        }
        console.log(`Selected categories: ${this.selectedCategories}`);
        this.onFilterChange(this.selectedCategories);
    }
}

export default Filter;
