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
        this.filterContainer.innerHTML = '';

        categories.forEach((category) => {
            const checkbox = document.createElement('input');
            const label = document.createElement('label');

            checkbox.type = 'checkbox';
            checkbox.dataset.id = category.id;
            checkbox.value = category.name;

            label.htmlFor = category.name;
            label.textContent = category.name;
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
        if (checkbox.checked) {
            this.selectedCategories = [...this.selectedCategories, category];
        } else {
            this.selectedCategories = this.selectedCategories.filter(
                (selectedCategory) => selectedCategory !== category
            );
        }
        this.onFilterChange(this.selectedCategories);
    }
}

export default Filter;
